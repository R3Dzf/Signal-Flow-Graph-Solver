"""Parse symbolic signal-flow gains without evaluating arbitrary Python code."""

import ast
import math

import sympy as sp

_ALLOWED_FUNCTIONS = {
    "sin": sp.sin, "cos": sp.cos, "tan": sp.tan,
    "asin": sp.asin, "acos": sp.acos, "atan": sp.atan,
    "sinh": sp.sinh, "cosh": sp.cosh, "tanh": sp.tanh,
    "exp": sp.exp, "log": sp.log, "sqrt": sp.sqrt,
    "Abs": sp.Abs, "Rational": sp.Rational,
}
_ALLOWED_CONSTANTS = {"pi": sp.pi, "E": sp.E, "I": sp.I}
_MAX_EXPRESSION_LENGTH = 256
_MAX_AST_NODES = 96
_MAX_LITERAL_EXPONENT = 100


def parse_gain(source: str) -> sp.Expr:
    """Parse gains such as G1*G2, 1/(s+1), and sqrt(s^2+1).

    The restricted AST allows numbers, symbols, arithmetic and a short list
    of math functions. It never evaluates a gain as arbitrary Python code.
    """
    expression = (source or "").strip().replace("^", "**")
    if not expression:
        raise ValueError("Gain expression is empty")
    if len(expression) > _MAX_EXPRESSION_LENGTH:
        raise ValueError("Gain expression is too long")

    try:
        parsed = ast.parse(expression, mode="eval")
    except SyntaxError as exc:
        raise ValueError("Invalid gain expression syntax") from exc
    if sum(1 for _ in ast.walk(parsed)) > _MAX_AST_NODES:
        raise ValueError("Gain expression is too complex")

    def convert(node: ast.AST) -> sp.Expr:
        if isinstance(node, ast.Constant):
            value = node.value
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                raise ValueError("Only numeric constants are allowed")
            if isinstance(value, float):
                if not math.isfinite(value):
                    raise ValueError("Gain constants must be finite")
                return sp.Float(str(value))
            return sp.Integer(value)
        if isinstance(node, ast.Name):
            return _ALLOWED_CONSTANTS.get(node.id, sp.Symbol(node.id))
        if isinstance(node, ast.UnaryOp):
            operand = convert(node.operand)
            if isinstance(node.op, ast.USub):
                return -operand
            if isinstance(node.op, ast.UAdd):
                return operand
        if isinstance(node, ast.BinOp):
            left, right = convert(node.left), convert(node.right)
            if isinstance(node.op, ast.Add):
                return left + right
            if isinstance(node.op, ast.Sub):
                return left - right
            if isinstance(node.op, ast.Mult):
                return left * right
            if isinstance(node.op, ast.Div):
                return left / right
            if isinstance(node.op, ast.Pow):
                if right.is_number and not right.free_symbols:
                    if right.is_real is not True or abs(right) > _MAX_LITERAL_EXPONENT:
                        raise ValueError("Numeric exponent is outside the supported range")
                return left ** right
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            function = _ALLOWED_FUNCTIONS.get(node.func.id)
            if function is not None and not node.keywords:
                try:
                    return function(*(convert(arg) for arg in node.args))
                except (TypeError, ValueError, ZeroDivisionError) as exc:
                    raise ValueError("Invalid gain function arguments") from exc
        raise ValueError("Unsupported gain expression construct")

    try:
        return convert(parsed.body)
    except (TypeError, ZeroDivisionError) as exc:
        raise ValueError("Invalid gain expression") from exc
