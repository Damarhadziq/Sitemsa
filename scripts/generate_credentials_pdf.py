import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def generate_pdf():
    pdf_filename = "Akun_Resmi_Tim_Sitemsa_SMKN1Semarang.pdf"
    output_dirs = [
        "public/documents",
        "C:/Users/Acer/.gemini/antigravity-ide/brain/23266ff1-80eb-4404-b2ea-4d87a0d70d64"
    ]
    
    for d in output_dirs:
        os.makedirs(d, exist_ok=True)
        
    target_path = os.path.join("public/documents", pdf_filename)
    artifact_path = os.path.join("C:/Users/Acer/.gemini/antigravity-ide/brain/23266ff1-80eb-4404-b2ea-4d87a0d70d64", pdf_filename)

    doc = SimpleDocTemplate(
        target_path,
        pagesize=A4,
        rightMargin=1.2*cm,
        leftMargin=1.2*cm,
        topMargin=1.2*cm,
        bottomMargin=1.2*cm
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#1E40AF") # Deep Blue
    secondary_color = colors.HexColor("#2563EB")
    dark_text = colors.HexColor("#1E293B")
    muted_text = colors.HexColor("#64748B")
    light_bg = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#E2E8F0")
    prodi_header_bg = colors.HexColor("#EFF6FF")
    student_header_bg = colors.HexColor("#ECFDF5")

    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=17,
        textColor=primary_color,
        alignment=TA_CENTER
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=muted_text,
        alignment=TA_CENTER
    )

    prodi_title_style = ParagraphStyle(
        'ProdiTitle',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#1D4ED8")
    )

    student_title_style = ParagraphStyle(
        'StudentTitle',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor("#047857")
    )

    cell_bold = ParagraphStyle(
        'CellBold',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=dark_text
    )

    cell_regular = ParagraphStyle(
        'CellRegular',
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=dark_text
    )

    cell_mono = ParagraphStyle(
        'CellMono',
        fontName='Courier-Bold',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#0F766E")
    )

    cell_badge = ParagraphStyle(
        'CellBadge',
        fontName='Helvetica-Bold',
        fontSize=6.5,
        leading=8.5,
        textColor=colors.HexColor("#4338CA")
    )

    elements = []

    # Header / Kop Dokumen
    elements.append(Paragraph("<b>SITEMSA — SISTEM PEMBELAJARAN DIGITAL VOKASI</b>", title_style))
    elements.append(Paragraph("Daftar Kredensial Akun Resmi Tim Pengembang PPL Lantip SMK Negeri 1 Semarang & Akun Uji Coba Siswa", subtitle_style))
    elements.append(Paragraph("Tahun Ajaran 2025/2026 • Portal Login Utama: <u>https://sitemsa.vercel.app/login</u>", subtitle_style))
    elements.append(Spacer(1, 6))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=2, spaceAfter=8))

    # Info Banner Box
    info_data = [
        [Paragraph("<b>PANDUAN MASUK (LOGIN) & KEAMANAN SESSION:</b><br/>"
                   "• <b>Siswa</b>: Masuk melalui <b>/login</b> menggunakan email <code>siswa@belajar.id</code> dan password <code>SiswaSitemsa#2026</code>.<br/>"
                   "• <b>Guru & Tim Pengembang</b>: Masuk melalui <b>/admin/login</b> atau <b>/admin/guru</b> menggunakan kredensial per program studi.<br/>"
                   "• <b>Super Administrator (Damar Hadziq H.)</b>: Mengelola seluruh mata pelajaran, konten web, dan akun pengembang.", cell_regular)]
    ]
    info_table = Table(info_data, colWidths=[18.6*cm])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), light_bg),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 8))

    # Data 24 Anggota per Prodi
    divisions_data = [
        {
            "name": "1. Pendidikan Teknik Informatika dan Komputer (Pend. Informatika)",
            "members": [
                {"no": "1", "name": "Damar Hadziq H.", "role": "Developer / Superadmin", "email": "damar.guru@sitemsa.sch.id", "pass": "SitemsaAdmin2026!", "subject": "Semua Bidang (Superadmin)"},
                {"no": "2", "name": "Mochammad Rizal D. D.", "role": "Sub-Developer / Guru", "email": "rizal.guru@sitemsa.sch.id", "pass": "RizalSitemsa#2026", "subject": "Informatika"},
                {"no": "3", "name": "M. Sulthon Abdullah A.", "role": "Sub-Developer / Guru", "email": "sulthon.guru@sitemsa.sch.id", "pass": "SulthonSitemsa#2026", "subject": "Informatika"},
                {"no": "4", "name": "Lovyca Imeyra E.", "role": "Sub-Developer / Guru", "email": "lovyca.guru@sitemsa.sch.id", "pass": "LovycaSitemsa#2026", "subject": "Informatika"},
            ]
        },
        {
            "name": "2. Bimbingan dan Konseling (BK)",
            "members": [
                {"no": "5", "name": "Innova Riskianugrah R.", "role": "Instructional Designer / Guru", "email": "innova.guru@sitemsa.sch.id", "pass": "InnovaBK#2026", "subject": "Bimbingan Konseling"},
                {"no": "6", "name": "Fateka Maulana A. K.", "role": "Instructional Designer / Guru", "email": "fateka.guru@sitemsa.sch.id", "pass": "FatekaBK#2026", "subject": "Bimbingan Konseling"},
                {"no": "7", "name": "Erintan Tsuraya Rahadatul'Aisy", "role": "Instructional Designer / Guru", "email": "erintan.guru@sitemsa.sch.id", "pass": "ErintanBK#2026", "subject": "Bimbingan Konseling"},
                {"no": "8", "name": "Dinda Riestia", "role": "Instructional Designer / Guru", "email": "dinda.guru@sitemsa.sch.id", "pass": "DindaBK#2026", "subject": "Bimbingan Konseling"},
            ]
        },
        {
            "name": "3. Pendidikan Teknik Otomotif (Pend. Otomotif)",
            "members": [
                {"no": "9", "name": "Ardyan Santoso", "role": "Instructional Designer / Guru", "email": "ardyan.guru@sitemsa.sch.id", "pass": "ArdyanOto#2026", "subject": "Otomotif"},
                {"no": "10", "name": "Satrio", "role": "Instructional Designer / Guru", "email": "satrio.guru@sitemsa.sch.id", "pass": "SatrioOto#2026", "subject": "Otomotif"},
                {"no": "11", "name": "Agam Ainun Ramadhan", "role": "Instructional Designer / Guru", "email": "agam.guru@sitemsa.sch.id", "pass": "AgamOto#2026", "subject": "Otomotif"},
            ]
        },
        {
            "name": "4. Pendidikan Teknik Elektronika (Pend. Elektronika)",
            "members": [
                {"no": "12", "name": "Banu Mahmuda H.", "role": "Instructional Designer / Guru", "email": "banu.guru@sitemsa.sch.id", "pass": "BanuElk#2026", "subject": "Elektronika"},
                {"no": "13", "name": "Anisa Susilawati", "role": "Instructional Designer / Guru", "email": "anisa.guru@sitemsa.sch.id", "pass": "AnisaElk#2026", "subject": "Elektronika"},
                {"no": "14", "name": "Nova Milyard", "role": "Instructional Designer / Guru", "email": "nova.guru@sitemsa.sch.id", "pass": "NovaElk#2026", "subject": "Elektronika"},
                {"no": "15", "name": "Vella Pratika I. N.", "role": "Instructional Designer / Guru", "email": "vella.guru@sitemsa.sch.id", "pass": "VellaElk#2026", "subject": "Elektronika"},
                {"no": "16", "name": "Fahrul Adiyansa", "role": "Instructional Designer / Guru", "email": "fahrul.guru@sitemsa.sch.id", "pass": "FahrulElk#2026", "subject": "Elektronika"},
                {"no": "17", "name": "Tubagus Fauzan A.", "role": "Instructional Designer / Guru", "email": "tubagus.guru@sitemsa.sch.id", "pass": "TubagusElk#2026", "subject": "Elektronika"},
            ]
        },
        {
            "name": "5. Pendidikan Jasmani, Kesehatan, dan Rekreasi (Pend. Olahraga)",
            "members": [
                {"no": "18", "name": "Brilian Anugraheni", "role": "Instructional Designer / Guru", "email": "brilian.guru@sitemsa.sch.id", "pass": "BrilianPjok#2026", "subject": "Olahraga & Kesehatan"},
                {"no": "19", "name": "Ahmad Luthfi F.", "role": "Instructional Designer / Guru", "email": "luthfi.guru@sitemsa.sch.id", "pass": "LuthfiPjok#2026", "subject": "Olahraga & Kesehatan"},
                {"no": "20", "name": "Rinal Febriarso D. P.", "role": "Instructional Designer / Guru", "email": "rinal.guru@sitemsa.sch.id", "pass": "RinalPjok#2026", "subject": "Olahraga & Kesehatan"},
            ]
        },
        {
            "name": "6. Pendidikan Seni Tari (Pend. Seni Tari)",
            "members": [
                {"no": "21", "name": "Vivi Riska Wardani", "role": "Instructional Designer / Guru", "email": "vivi.guru@sitemsa.sch.id", "pass": "ViviTari#2026", "subject": "Seni Tari"},
                {"no": "22", "name": "Anita Dwi Ningtyas", "role": "Instructional Designer / Guru", "email": "anita.guru@sitemsa.sch.id", "pass": "AnitaTari#2026", "subject": "Seni Tari"},
                {"no": "23", "name": "Meliana Dwi Yanti", "role": "Instructional Designer / Guru", "email": "meliana.guru@sitemsa.sch.id", "pass": "MelianaTari#2026", "subject": "Seni Tari"},
                {"no": "24", "name": "Hasnita Ivangka", "role": "Instructional Designer / Guru", "email": "ivangka.guru@sitemsa.sch.id", "pass": "IvangkaTari#2026", "subject": "Seni Tari"},
            ]
        }
    ]

    for div in divisions_data:
        # Heading per Prodi
        elements.append(Paragraph(f"<b>{div['name']}</b>", prodi_title_style))
        elements.append(Spacer(1, 2))

        # Table data
        table_rows = [
            [
                Paragraph("<b>No</b>", cell_bold),
                Paragraph("<b>Nama Lengkap Anggota</b>", cell_bold),
                Paragraph("<b>Peran / Jabatan</b>", cell_bold),
                Paragraph("<b>Email Login</b>", cell_bold),
                Paragraph("<b>Password Default</b>", cell_bold),
                Paragraph("<b>Bidang Kelola</b>", cell_bold)
            ]
        ]

        for m in div['members']:
            table_rows.append([
                Paragraph(m['no'], cell_regular),
                Paragraph(f"<b>{m['name']}</b>", cell_regular),
                Paragraph(m['role'], cell_badge),
                Paragraph(m['email'], cell_mono),
                Paragraph(m['pass'], cell_mono),
                Paragraph(m['subject'], cell_regular)
            ])

        t = Table(table_rows, colWidths=[0.7*cm, 4.4*cm, 3.6*cm, 4.6*cm, 3.1*cm, 2.2*cm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), prodi_header_bg),
            ('GRID', (0,0), (-1,-1), 0.5, border_color),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 2.8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2.8),
            ('LEFTPADDING', (0,0), (-1,-1), 3.5),
            ('RIGHTPADDING', (0,0), (-1,-1), 3.5),
        ]))

        elements.append(t)
        elements.append(Spacer(1, 6))

    # Section 7: Akun Resmi Siswa untuk Uji Coba
    elements.append(Spacer(1, 2))
    elements.append(Paragraph("<b>7. Akun Pengguna Siswa Resmi (Uji Coba Web Siswa)</b>", student_title_style))
    elements.append(Spacer(1, 2))

    student_rows = [
        [
            Paragraph("<b>No</b>", cell_bold),
            Paragraph("<b>Nama Lengkap Siswa</b>", cell_bold),
            Paragraph("<b>NISN / Kelas</b>", cell_bold),
            Paragraph("<b>Email Login Siswa</b>", cell_bold),
            Paragraph("<b>Password Default</b>", cell_bold),
            Paragraph("<b>Hak Akses</b>", cell_bold)
        ],
        [
            Paragraph("1", cell_regular),
            Paragraph("<b>Budi Santoso</b>", cell_regular),
            Paragraph("0071234567 • XI PPLG 1", cell_regular),
            Paragraph("siswa@belajar.id", cell_mono),
            Paragraph("SiswaSitemsa#2026", cell_mono),
            Paragraph("Materi, Kuis, Nilai", cell_badge)
        ]
    ]
    st = Table(student_rows, colWidths=[0.7*cm, 4.4*cm, 3.6*cm, 4.6*cm, 3.1*cm, 2.2*cm])
    st.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), student_header_bg),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 3.5),
        ('RIGHTPADDING', (0,0), (-1,-1), 3.5),
    ]))
    elements.append(st)

    # Footer note
    elements.append(Spacer(1, 4))
    elements.append(HRFlowable(width="100%", thickness=0.8, color=border_color, spaceBefore=2, spaceAfter=4))
    elements.append(Paragraph("<i>*Catatan: Dokumen ini bersifat resmi dan rahasia. Dikeluarkan untuk operasional pembelajaran digital Sitemsa SMKN 1 Semarang.</i>", subtitle_style))

    doc.build(elements)

    # Copy to artifact folder as well
    import shutil
    shutil.copy2(target_path, artifact_path)
    print(f"Successfully generated PDF at: {target_path} and {artifact_path}")

if __name__ == "__main__":
    generate_pdf()
