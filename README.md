# Signal Flow Graph Solver

A web-based engineering tool for solving **Signal Flow Graph (SFG)** problems using **Mason's Gain Formula** and symbolic mathematics.

The application allows users to build a signal-flow graph, validate its structure, identify forward paths and loops, calculate non-touching loop combinations, and obtain the final transfer function with step-by-step intermediate results.

## Key Features

- Interactive signal-flow graph input through a web interface.
- Symbolic edge gains such as `G1`, `H1`, or algebraic expressions.
- Graph validation before solving.
- Automatic detection of:
  - Forward paths
  - Individual loops
  - Non-touching loop combinations
- Automatic calculation of Mason's determinant (Δ) and path cofactors (Δk).
- Final symbolic transfer-function calculation.
- Independent transfer-function verification using a linear-system formulation.
- Support for parallel branches through internal dummy-node handling.
- API-based backend that can be reused by other frontends.

## Tech Stack

### Backend
- Python
- FastAPI
- NetworkX
- SymPy
- Pydantic

### Frontend
- HTML / CSS / JavaScript
- Cytoscape.js
- Dagre graph layout
- Konva.js
- jQuery

## How It Works

1. The user defines graph nodes and directed connections with symbolic gains.
2. The backend validates the graph and verifies that an input-to-output path exists.
3. NetworkX is used to find simple paths and cycles.
4. SymPy performs symbolic gain calculations and expression simplification.
5. Mason's Gain Formula is evaluated from the detected paths and loops.
6. The result is cross-checked using an independently constructed linear-equation system.
7. The frontend displays the transfer function and the graph-analysis details.

## API Endpoints

### `POST /validate`
Validates graph structure, node names, edge gains, and input/output connectivity.

### `POST /solve`
Returns the transfer function together with forward paths, loops, non-touching loop combinations, Δ, and symbolic intermediate results.

## Run Locally

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

Then open:

```text
http://127.0.0.1:8000
```

## Project Structure

```text
sfg-solver/
├── app.py
├── requirements.txt
├── frontend/
│   ├── index.html
│   └── JavaScript libraries
└── README.md
```

## Engineering Value

This project combines **Control Systems**, **Graph Theory**, **Symbolic Mathematics**, and **Web Development** in one practical application. It was built to automate calculations that are normally solved manually using Mason's Gain Formula and to expose the intermediate engineering steps instead of returning only a final result.

## Future Improvements

- Add automated test coverage for known SFG examples.
- Add graph import/export.
- Add downloadable solution reports.
- Improve responsive/mobile graph editing.
- Add a hosted live demo.

## Author

**Ahmed Youssef Bosha**

Computer and Control Engineering — Tanta University