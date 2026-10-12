"""Regression tests for the signal-flow graph solver.

Run from the repository root with: python -m unittest discover -s tests -v
"""
import unittest

import sympy as sp

from app import Connection, DiagramData, _delta_from_loops, solve_diagram, validate_diagram


def diagram(edges, *, nodes=None, input_node="S", output_node="T"):
    return DiagramData(
        nodes=nodes if nodes is not None else ["S", "T"],
        input_node=input_node,
        output_node=output_node,
        connections=[
            Connection(id=f"edge-{index}", from_node=start, to_node=end, gain=gain)
            for index, (start, end, gain) in enumerate(edges)
        ],
    )


def assert_equivalent(testcase, actual, expected):
    testcase.assertEqual(sp.simplify(sp.sympify(actual) - sp.sympify(expected)), 0)


class SolverRegressionTests(unittest.TestCase):
    def test_series_edges_multiply(self):
        result = solve_diagram(
            diagram(
                [("S", "A", "G1"), ("A", "T", "G2")],
                nodes=["S", "A", "T"],
            )
        )
        self.assertEqual(result["status"], "success")
        self.assertFalse(result["mason_mismatch"])
        assert_equivalent(self, result["transfer_function_expr"], "G1*G2")
        self.assertEqual(len(result["paths"]), 1)

    def test_parallel_edges_add_instead_of_overwriting(self):
        result = solve_diagram(
            diagram([("S", "T", "G1"), ("S", "T", "G2")])
        )
        self.assertEqual(result["status"], "success")
        self.assertFalse(result["mason_mismatch"])
        assert_equivalent(self, result["transfer_function_expr"], "G1 + G2")
        self.assertEqual(len(result["paths"]), 2)

    def test_single_feedback_loop(self):
        result = solve_diagram(
            diagram(
                [("S", "A", "G"), ("A", "T", "H"), ("A", "A", "K")],
                nodes=["S", "A", "T"],
            )
        )
        self.assertEqual(result["status"], "success")
        self.assertFalse(result["mason_mismatch"])
        assert_equivalent(self, result["transfer_function_expr"], "G*H/(1-K)")
        self.assertEqual(len(result["loops"]), 1)

    def test_disjoint_loops_produce_second_order_delta_term(self):
        loops = [
            {"nodes": {"A"}, "ordered_nodes": ["A"], "gain": sp.Symbol("L1"), "edge_ids": ["a"]},
            {"nodes": {"B"}, "ordered_nodes": ["B"], "gain": sp.Symbol("L2"), "edge_ids": ["b"]},
        ]
        delta, non_touching = _delta_from_loops(loops)
        assert_equivalent(self, str(delta), "(1-L1)*(1-L2)")
        self.assertEqual(len(non_touching[2]), 1)
        self.assertCountEqual(non_touching[2][0]["combo_edge_ids"], ["a", "b"])

    def test_touching_loops_have_no_second_order_term(self):
        loops = [
            {"nodes": {"A", "B"}, "ordered_nodes": ["A", "B"], "gain": sp.Symbol("L1")},
            {"nodes": {"B", "C"}, "ordered_nodes": ["B", "C"], "gain": sp.Symbol("L2")},
        ]
        delta, non_touching = _delta_from_loops(loops)
        assert_equivalent(self, str(delta), "1-L1-L2")
        self.assertEqual(non_touching, {})

    def test_validate_rejects_duplicate_node_names(self):
        result = validate_diagram(diagram([], nodes=["S", "T", "S"]))
        self.assertEqual(result["status"], "error")
        self.assertIn("duplicate_node_names", {e["type"] for e in result["errors"]})

    def test_validate_rejects_empty_gain(self):
        result = validate_diagram(diagram([("S", "T", "")]))
        self.assertEqual(result["status"], "error")
        self.assertIn("missing_gain", {e["type"] for e in result["errors"]})

    def test_validate_rejects_missing_output_node(self):
        result = validate_diagram(
            diagram([("S", "A", "G")], nodes=["S", "A"], output_node="T")
        )
        self.assertEqual(result["status"], "error")
        self.assertIn("missing_output_node", {e["type"] for e in result["errors"]})

    def test_validate_reports_off_path_and_isolated_nodes(self):
        result = validate_diagram(
            diagram([("S", "T", "G")], nodes=["S", "T", "Z"])
        )
        self.assertEqual(result["status"], "success")
        warning_types = {w["type"] for w in result["warnings"]}
        self.assertIn("off_path_nodes", warning_types)
        self.assertIn("isolated_nodes", warning_types)


if __name__ == "__main__":
    unittest.main()
