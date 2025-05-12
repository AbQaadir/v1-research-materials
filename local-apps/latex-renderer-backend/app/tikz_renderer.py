import subprocess
import tempfile
import os


def render_tikz(tikz_code: str) -> str:
    with tempfile.TemporaryDirectory() as tmpdir:
        tex_file = os.path.join(tmpdir, "output.tex")
        pdf_file = os.path.join(tmpdir, "output.pdf")
        jpg_file = os.path.join(tmpdir, "output.jpg")  # Change to JPG

        with open(tex_file, "w") as f:
            f.write(tikz_code)

        # Compile LaTeX to PDF
        subprocess.run(["pdflatex", "-output-directory", tmpdir, tex_file], check=True)

        # Convert PDF to JPG
        subprocess.run(["convert", "-density", "300", pdf_file, "-quality", "95", jpg_file], check=True)

        # Copy JPG to a fixed location or return path
        final_path = "/tmp/output.jpg"
        os.rename(jpg_file, final_path)

        return final_path

