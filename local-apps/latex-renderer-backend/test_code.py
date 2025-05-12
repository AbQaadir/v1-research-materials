import requests
import base64
import os

latex_code = r"""
\begin{figure}[htbp]
\centering
\begin{tikzpicture}[
    node distance=1.5cm and 2cm, % Vertical and horizontal spacing
    block/.style={rectangle, draw, fill=blue!20, text width=8em, text centered, rounded corners, minimum height=3em},
    line/.style={draw, -latex'}, % Arrow style (latex' is a common arrow tip)
    decision/.style={diamond, draw, fill=green!20, text width=7em, text badly centered, inner sep=0pt, aspect=2},
    terminator/.style={ellipse, draw, fill=red!20, text centered, minimum height=3em}
]
    % Nodes
    \node [terminator] (start) {Start};
    \node [block, below=of start] (process1) {Process 1: Initialize};
    \node [decision, below=of process1, yshift=-0.5cm] (decide) {Is condition met?};
    \node [block, left=of decide, xshift=-1cm] (process2a) {Process 2a: Action if Yes};
    \node [block, right=of decide, xshift=1cm] (process2b) {Process 2b: Action if No};
    \node [terminator, below=of decide, yshift=-1.5cm, xshift=2cm] (end) {End}; % Adjusted position for end

    % Edges
    \path [line] (start) -- (process1);
    \path [line] (process1) -- (decide);
    \path [line] (decide) -- node[above] {Yes} (process2a);
    \path [line] (decide) -- node[above] {No} (process2b);
    \path [line] (process2a) |- (end); % Using |- for a right-angle turn
    \path [line] (process2b) -- (end);

\end{tikzpicture}
\caption{A simple flowchart.}
\label{fig:flowchart}
\end{figure}
"""

response = requests.post(
    "http://localhost:8000/render",
    json={"code": latex_code}
)

# reponse.content is base64 encoded image data
image_data = response.json()["image_base64"]
with open("output.jpg", "wb") as f:
    f.write(base64.b64decode(image_data))
print("Image saved as output.jpg")
