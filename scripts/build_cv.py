"""Build the one-page academic CV linked from the personal site."""

from pathlib import Path

from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "cv" / "Hyunsu_Go_CV.pdf"
FONT_DIR = Path("C:/Windows/Fonts")

pdfmetrics.registerFont(TTFont("Arial", str(FONT_DIR / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT_DIR / "arialbd.ttf")))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-Bold")

PAGE_W, PAGE_H = A4
LEFT = 49
RIGHT = PAGE_W - 49
WIDTH = RIGHT - LEFT

def paragraph(pdf, value, x, top, width, *, size=9.2, leading=13.5, font="Arial"):
    style = ParagraphStyle(
        name="cv",
        fontName=font,
        fontSize=size,
        leading=leading,
        alignment=TA_LEFT,
        spaceBefore=0,
        spaceAfter=0,
    )
    item = Paragraph(value, style)
    _, height = item.wrap(width, PAGE_H)
    item.drawOn(pdf, x, top - height)
    return top - height


def label(pdf, value, x, baseline, *, size=9.0, font="Arial"):
    pdf.setFillColorRGB(0, 0, 0)
    pdf.setFont(font, size)
    pdf.drawString(x, baseline, value)


def section(pdf, value, top):
    label(pdf, value.upper(), LEFT, top - 10, size=10.1, font="Arial-Bold")
    return top - 24


def entry(pdf, title, detail, date, top, *, note=None):
    label(pdf, title, LEFT, top - 9, size=9.7, font="Arial-Bold")
    pdf.setFont("Arial", 8.7)
    pdf.setFillColorRGB(0, 0, 0)
    pdf.drawRightString(RIGHT, top - 8, date)
    label(pdf, detail, LEFT, top - 23, size=8.8)
    if note:
        bottom = paragraph(pdf, note, LEFT, top - 29, WIDTH, size=8.8, leading=12.2)
        return bottom - 11
    return top - 37


def paper(pdf, title, authors, status, top):
    bottom = paragraph(pdf, title, LEFT, top, WIDTH, size=9.0, leading=12.5, font="Arial-Bold")
    bottom = paragraph(pdf, authors, LEFT, bottom - 4, WIDTH, size=8.2, leading=11.4)
    label(pdf, status, LEFT, bottom - 12, size=8.6)
    return bottom - 25


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    pdf.setTitle("Hyunsu Go - Curriculum Vitae")
    pdf.setAuthor("Hyunsu Go")
    pdf.setSubject("Research in visual computing and robotics")

    label(pdf, "Hyunsu Go", LEFT, 788, size=19, font="Arial-Bold")
    label(pdf, "Research Intern, Visual Computing Lab, Seoul National University", LEFT, 768, size=9.2)
    label(pdf, "hsmail02@snu.ac.kr  |  gohyunsu.github.io  |  github.com/gohyunsu", LEFT, 752, size=8.8)
    pdf.linkURL("mailto:hsmail02@snu.ac.kr", (LEFT, 747, LEFT + 113, 759), relative=0)
    pdf.linkURL("https://gohyunsu.github.io/", (LEFT + 125, 747, LEFT + 233, 759), relative=0)
    pdf.linkURL("https://github.com/gohyunsu", (LEFT + 245, 747, LEFT + 357, 759), relative=0)

    y = section(pdf, "Research interests", 729)
    y = paragraph(
        pdf,
        "3D visual understanding for adaptive robot manipulation: deciding when to act, observe again, or revise a plan, then learning from the outcome.",
        LEFT, y, WIDTH, size=9.2, leading=13.3,
    ) - 18

    y = section(pdf, "Education", y)
    y = entry(pdf, "Seoul National University", "Incoming integrated M.S.-Ph.D., Computer Science and Engineering", "Spring 2027", y)
    y = entry(pdf, "Seoul National University", "B.S., Mechanical Engineering; additional majors in Computer Science and Economics; GPA 4.12 / 4.30", "Feb 2027 (expected)", y) - 1

    y = section(pdf, "Research experience", y)
    y = entry(
        pdf, "Visual Computing Lab", "Research Intern, SNU Computer Science and Engineering", "Jun 2026 - Present", y,
        note="Supporting automated collection of visual observations and grasp outcomes for robotic grasping.",
    )
    y = entry(
        pdf, "Precision Bioinstrumentation Laboratory", "Undergraduate Researcher, SNU Mechanical Engineering", "Jul 2024 - May 2026", y,
        note="Analyzed full single-cell vibrational signals with deep learning.",
    )
    y = entry(
        pdf, "Imaging-driven Medical SuperIntelligence Group", "Student Researcher, SNU AI Semiconductor Engineering", "Aug 2025 - Apr 2026", y,
    ) - 1

    y = section(pdf, "Selected publications", y)
    y = paper(
        pdf,
        "Microfluidic vibrational transit signals encode multidimensional single-cell biophysical states",
        "Hyunju Ham, <b>Hyunsu Go</b>, Seoyeong Kim, Sechan Park, Jiyul Kim, Su Hyun Lee, Sanghyo Park, Jaehyung Park, Scott R. Manalis, Hyunsook Lee, Joon Ho Kang.",
        "2026  |  Submitted",
        y,
    )
    y = paper(
        pdf,
        "From Complete Scanpaths to Finding-Level Gaze Targets in Chest Radiography: Structured Cues and Learned Reweighting",
        "Sumin Lee, <b>Hyunsu Go</b>, Subeen Lee, Kyeonghun Kim, Nam-Joon Kim.",
        "2026  |  MedAI, Accepted",
        y,
    )
    y = paper(
        pdf,
        "MAESIL: Masked Autoencoder for Enhanced Self-Supervised Medical Image Learning",
        "Kyeonghun Kim, Hyeonseok Jung, Youngung Han, Junsu Lim, YeonJu Jean, Seongbin Park, Eunseob Choi, <b>Hyunsu Go</b>, SeoYoung Ju, Seohyoung Park, Gyeongmin Kim, MinJu Kwon, KyungSeok Yuh, Soo Yong Kim, Ken Ying-Kai Liao, Nam-Joon Kim, Hyuk-Jae Lee.",
        "2026  |  ICEIC, Published  |  doi:10.1109/ICEIC69189.2026.11386292",
        y,
    )

    y -= 3
    y = section(pdf, "Honors and scholarships", y)
    label(pdf, "Presidential Science Scholarship, Korea Student Aid Foundation", LEFT, y - 8, size=9.0)
    pdf.drawRightString(RIGHT, y - 8, "May 2023 - Present")
    label(pdf, "Semiconductor Specialization University Scholarship, SNU", LEFT, y - 26, size=9.0)
    pdf.drawRightString(RIGHT, y - 26, "Aug 2025 - Present")
    label(pdf, "Outstanding BS Thesis Presentation Award, SNU Mechanical Engineering", LEFT, y - 44, size=9.0)
    pdf.drawRightString(RIGHT, y - 44, "Jun 2026")

    if y - 48 < 40:
        raise RuntimeError(f"CV content is too close to the page edge: y={y:.1f}")
    pdf.showPage()
    pdf.save()
    print(OUTPUT)


if __name__ == "__main__":
    build()
