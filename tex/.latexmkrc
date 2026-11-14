# Compile with XeLaTeX (Unicode / Vietnamese names work without the T5 encoding package).
$pdf_mode = 5;
$dvi_mode = 0;
$postscript_mode = 0;
$xelatex = 'xelatex -synctex=1 -interaction=nonstopmode -file-line-error %O %S';
