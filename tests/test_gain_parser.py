"""Security and compatibility tests for the signal-flow gain parser."""

import unittest

import sympy as sp

from app import Connection, DiagramData, solve_diagram, validate_diagram
from gain_parser import parse_gain


class GainParserTests(unittest.TestCase):
    def test_arithmetic_and_control_system_notation(self):
        cases = [
            ("G1*G2", "G1*G2"),
            ("1/(s+1)", "1/(s+1)"),
            ("G_1^2/(1+H)", "G_1**2/(1+H)"),
            ("-0.5*H", "-0.5*H"),
            ("1e-3*s", "0.001*s"),
            ("Rational(1,2)*K", "K/2"),
            ("sin(s)+sqrt(s^2+1)", "sin(s)+sqrt(s**2+1)"),
        ]
        for expression, expected in cases:
            with self.subTest(expression=expression):
                actual = parse_gain(expression)
                self.assertEqual(sp.simplify(actual - sp.sympify(expected)), 0)

    def test_rejects_python_execution_and_attribute_access(self):
        invalid = [
            '__import__("os").system("echo unsafe")',
            'open("secret", "r")',
            "(0).__class__",
            "s[0]",
            "[G1 for G1 in (1,2)]",
            "lambda s: s",
            "Symbol('x')",
            "unknown_function(s)",
            "2**1000000",
        ]
        for expression in invalid:
            with self.subTest(expression=expression):
                with self.assertRaises(ValueError):
                    parse_gain(expression)

    def test_rejects_non_finite_or_oversized_expressions(self):
        for expression in ["1e309", "G" * 257, ""]:
            with self.subTest(expression=expression):
                with self.assertRaises(ValueError):
                    parse_gain(expression)

    def test_api_rejects_unsafe_gain_consistently(self):
        data = DiagramData(
            nodes=["S", "T"],
            input_node="S",
            output_node="T",
            connections=[
                Connection(
                    id="unsafe",
                    from_node="S",
                    to_node="T",
                    gain='__import__("os").system("echo unsafe")',
                )
            ],
        )
        validated = validate_diagram(data)
        solved = solve_diagram(data)
        self.assertEqual(validated["status"], "error")
        self.assertIn("invalid_gain", {e["type"] for e in validated["errors"]})
        self.assertEqual(solved["status"], "error")


if __name__ == "__main__":
    unittest.main()
