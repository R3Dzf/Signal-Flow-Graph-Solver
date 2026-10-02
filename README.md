# Signal Flow Graph Solver

An interactive web application for building and solving **Signal Flow Graphs (SFGs)** with **Mason's Gain Formula** and symbolic mathematics.

**Live demo:** https://sfg-solver.onrender.com/

## Highlights

- Interactive graph editor for nodes and directed branches.
- Symbolic gains such as `G1`, `H1`, `G1*G2`, and rational expressions.
- Automatic detection of forward paths, individual loops, and non-touching loop combinations.
- Mason's determinant (Δ), path cofactors (Δk), numerator, and final transfer function.
- Independent transfer-function verification using a linear-equation formulation.
- Graph validation, including duplicate node-name protection and input/output connectivity checks.
- Support for parallel branches.
- Built-in example graph for quick demonstration.
- Save/load diagrams as JSON and export the graph as PNG.
- English and Arabic interface, with English as the default language.

## Tech Stack

**Backend:** Python, FastAPI, NetworkX, SymPy, Pydantic  
**Frontend:** HTML, CSS, JavaScript, Cytoscape.js, Konva.js, jQuery

## How It Works

1. Build the signal-flow graph and assign gains to the directed branches.
2. The application validates the graph before solving.
3. NetworkX identifies forward paths and feedback loops.
4. SymPy evaluates the symbolic expressions.
5. Mason's Gain Formula is applied to calculate the transfer function.
6. The result is cross-checked using an independently constructed linear system.
7. The interface displays the final result together with the intermediate engineering steps.

## API

### `POST /validate`
Validates node names, edge gains, graph structure, and input/output connectivity.

### `POST /solve`
Returns the transfer function, forward paths, loops, non-touching loop combinations, Δ, and intermediate symbolic results.

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
Signal-Flow-Graph-Solver/
├── app.py
├── requirements.txt
├── frontend/
│   ├── index.html
│   ├── i18n.js
│   └── JavaScript libraries
└── README.md
```

## Engineering Value

The project combines **Control Systems**, **Graph Theory**, **Symbolic Mathematics**, and **Web Development** in one practical engineering tool. It is designed to show the intermediate Mason-formula calculations rather than only returning a final transfer function.

## Contact

**Ahmed Youssef Bosha**  
Computer & Control Engineering — Tanta University

- GitHub: https://github.com/R3Dzf
- WhatsApp: https://wa.me/201010449138
