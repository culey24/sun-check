# Ghi chú review — bản nháp Section 1, 3, 4, 5 (cập nhật 2026-11-15)

Bản nháp do Claude viết để từng người phụ trách đọc lại và **viết lại bằng giọng của mình**.
Theo quy định môn học, phần dùng AI phải khai báo trong Appendix A (xem mục 5).

Hiện tại: PDF 43 trang; phần nội dung chính (Section 1–6) nằm ở trang 6–39 (~34 trang, nằm trong khoảng 30–50 của yêu cầu).

## 1. Tình trạng từng section

| Section | Người phụ trách | Tình trạng |
| --- | --- | --- |
| 1 Market Opportunities | Lý Triều Phong | Nháp đủ 1.1 và 1.2, 2 biểu đồ, 1 sơ đồ, 1 bảng |
| 2 Evaluating the Market | Hoàng Hà | Đã có từ trước (chưa đổi, chỉ thêm 2 `\label`) |
| 3 Prototype / MVP | Tô Quốc Tài, Diệc Tuấn Chí | Nháp đủ, **cần ảnh và kết quả test thật** |
| 4 Business Model | Thái Thuận | Nháp đủ (canvas, value proposition, unit economics, rủi ro) |
| 5 Marketing / Sales | Nguyễn Lương Quốc Thịnh | Nháp đủ (STP, 4P, funnel, CAC, KPI) |
| 6 Financial | Phan Vũ Minh Thy | Đã có từ trước, không sửa |

## 2. Việc cần người của nhóm điền (TODO trong bài)

- **Bìa:** `INSTRUCTOR`, `CLASS`, `GROUP` trong `main.tex` vẫn là `TODO`.
- **Section 3:** ảnh chụp màn hình 4 trang của app (Hình 3.2 hiện là sơ đồ minh họa), ảnh patch thật (sáng, tối, trên da), cột **Result** của Bảng 3.5 (các bài test).
- **Số miếng patch trong mỗi gói chưa chốt** (Section 2 và 6 cũng ghi như vậy). Section 5 có nhắc "to be fixed after supplier tests".
- **Section 5:** conversion rate, repeat-purchase rate, scan frequency, mức ưu đãi (starter offer, bundle, referral) đang để "to be set" vì chưa có số liệu. Mình không tự bịa số.
- **Section 5/6:** chưa có bảng chia ngân sách marketing theo kênh (TikTok, Shopee, KOL, sự kiện). Chỉ có tổng 360 / 600 / 1.000 triệu VND từ Section 6.

## 3. Điểm cần xem xét kỹ (ảnh hưởng đến độ chính xác của báo cáo)

1. **LTV và sản lượng chưa khớp (Section 6).** LTV giả định 3 gói/năm × 2 năm = 330.000 VND. Nhưng sản lượng dự báo (18.000 / 50.000 / 100.000 gói) trên số khách mới (12.000 / 30.000 / 60.000) chỉ tương ứng khoảng 1,5–1,7 gói mỗi khách mới. Nếu khách cũ mua 3 gói/năm thì sản lượng năm 2–3 phải cao hơn nhiều. Cần nhóm Section 6 thống nhất lại (hoặc giảm LTV, hoặc tăng sản lượng). Trong Section 5 mình để một comment `%` ở đầu file, chưa đưa vào văn bản.
2. **Hạn chế của cảm biến photochromic.** Aguilera et al. (2024) test 10 thiết bị thương mại: màu đổi trong khoảng 1 phút kể cả khi có kem SPF 50+ ở UV index 10, và bão hòa từ UV index > 3. Kết luận của họ: chỉ phù hợp để nâng cao nhận thức, không đo được liều UV. Vì UV ở Việt Nam thường > 9 (Hình 1.1), đây là rủi ro lớn nhất của sản phẩm. Mình đã ghi thẳng điều này ở Section 3 (Known Limitations) và Section 4 (bảng rủi ro), và định vị Uvie là **công cụ nhắc nhở**, không phải thiết bị đo. Nhóm nên test thật trước khi tuyên bố bất cứ điều gì về độ chính xác.
3. **Bằng sáng chế.** Sản phẩm sticker mà nhóm dùng làm đối chứng (SPOTMYUV) gắn với đơn sáng chế WO2018035514 về phân tử photochromic (theo Horsham et al. 2020). Nhóm nên kiểm tra freedom-to-operate (đã ghi trong bảng rủi ro Section 4).
4. **Phân loại pháp lý chưa rõ.** Mình chỉ dẫn Thông tư 06/2011/TT-BYT (mỹ phẩm, sửa đổi bởi Thông tư 34/2025/TT-BYT) như điểm khởi đầu. Chưa biết patch có thuộc mỹ phẩm hay loại khác. Bài đã ghi rõ "không phải tư vấn pháp lý".
5. **Thuật ngữ:** repo và SPEC dùng "sticker", Section 1/6 dùng "patch"; Section 6 viết "mobile application" nhưng sản phẩm thực tế là **web app** (sun-check.onrender.com). Nên thống nhất.
6. **Section 6 (đã báo từ trước):** CAGR của IMARC 5,21% so với ≈5,4% tính lại; phần tăng vốn lưu động trong FCFF (100/150/200) khác với thay đổi hàng tồn kho + phải thu trên bảng cân đối (130/220/350).
7. **Bằng chứng hành vi bôi lại kem chủ yếu từ Mỹ và New Zealand**, chưa có khảo sát Việt Nam. Nên làm khảo sát nhỏ (Google Form) cho sinh viên; kết quả có thể đưa vào Appendix B.

## 4. Nguồn đã dùng và chỗ cần kiểm tra lại

Mình dùng tìm kiếm web; một số trang (PMC, KrASIA, Q&Me, các trang luật) không đọc được toàn văn nên số liệu lấy từ phần trích/abstract. **Mỗi người hãy mở lại nguồn của mình để xác nhận số liệu trước khi nộp:**

- Section 3: Horsham et al. 2020 (>3 lần lượng kem chống nắng dùng, 19% → 81% theo thông cáo của QUT; bài ghi ">3-fold"), Hacker et al. 2019, Aguilera et al. 2024.
- Section 4: KrASIA 2026 (Shopee 56,04%, TikTok Shop 41,31%, hai sàn chiếm 97% GMV), Osterwalder & Pigneur 2010, Thông tư 06/2011 và 34/2025.
- Section 5: Q&Me Vietnam Mobile App Usage Trends 2026 (82% dùng TikTok trong 7 ngày), DataReportal Digital 2026, Kotler et al. 2017 (5A), Moore 2014, Aulet 2017.
- Sách giáo trình (Olsen 2015, Osterwalder 2010, Kotler 2017, Aulet 2017, Moore 2014) lấy theo slide môn học, chưa đối chiếu lại với sách.
- Số liệu tính trong bài (đều lấy từ Section 6): CAC = 360/12.000 = 30.000; 600/30.000 = 20.000; 1.000/60.000 = 16.667; ngân sách/doanh thu = 22,5% / 13,5% / 11,2%; LTV/CAC năm 1 = 11,0; chỉ mua 1 lần thì 55.000/30.000 ≈ 1,8.

## 5. Khai báo AI (Appendix A)

Appendix A hiện chỉ có dòng của Hoàng Hà (Section 2). Cần thêm dòng cho Section 1, 3, 4, 5 với đúng tên người phụ trách, công cụ (Claude), và việc đã làm: *tìm nguồn, soạn nháp, tạo biểu đồ, kiểm tra LaTeX*. Nếu người phụ trách viết lại phần lớn thì ghi đúng mức độ chỉnh sửa. Quy định môn học: bài không được do AI tạo ra toàn bộ hoặc phần lớn.

## 6. Gợi ý nhỏ cho Section 1

Có thể thêm câu về Horsham et al. 2020 (sticker UV giúp tăng lượng kem chống nắng dùng ở vận động viên trẻ) vào mục 1.2 làm bằng chứng cho lý do 2; hiện tại nguồn này mới xuất hiện ở Section 3.

## 7. Phụ lục B, C, D (thêm 2026-11-15)

- **Appendix B (khảo sát):** có bộ câu hỏi 14 câu, phương pháp, và các bảng kết quả **để trống** (ô đỏ `[TBD]`). Mình không tự tạo số liệu khảo sát. Cách làm: tạo Google Form theo bảng B.1 (tiêu đề câu hỏi bắt đầu bằng `Q1.`, `Q2.`...), thu ít nhất 30 người từ 18 tuổi, xuất CSV, rồi chạy `python3 survey/analyze_survey.py responses.csv` trong thư mục `tex/survey/`. Script ghi `results.tex` (có khoảng tin cậy 95%), sau đó build lại. File CSV đã được đưa vào `.gitignore` vì chứa dữ liệu cá nhân. Sau khi có số, viết 3-4 câu ở mục B.5. Nếu nhóm không làm khảo sát, nên bỏ Appendix B (hoặc ghi rõ "chưa thực hiện") thay vì để bảng trống.
- **Appendix C (photochromic):** cơ chế SP ⇄ MC, ý nghĩa với Uvie, kế hoạch đo đặc tính (chưa đo gì).
- **Appendix D (future work):** ý tưởng phòng thí nghiệm ảo với chemical ontology (3 tầng: ontology, knowledge graph, mô hình dự đoán) và lộ trình 4 giai đoạn. Chỉ là ý tưởng, không nằm trong MVP hay dự báo tài chính.
- Nguồn mới: Klajn 2014, Hastings 2016 (ChEBI), Abolhasani & Kumacheva 2023, Tom et al. 2024, Lo et al. 2024, Bai et al. 2024, Schilling et al. 2026. Nhờ kiểm tra lại số trang/tập của Bai 2024 và Schilling 2026 (mình chưa xác nhận được thông tin đầy đủ).
- Nên khai báo thêm AI cho các phụ lục này trong Appendix A.

## 8. Cập nhật từ báo cáo cũ (UVie.docx)

- Đã thêm mục **Product Concept** và **Hình 3.1** (ảnh minh họa patch trên tay + app) vào Section 3. Ảnh này trông như **ảnh do AI tạo** (có dấu ngôi sao 4 cánh ở góc dưới phải) và giao diện trong ảnh không giống app thật, nên chú thích ghi rõ là "ảnh minh họa, không phải ảnh sản phẩm hoàn chỉnh". Nếu đúng là AI tạo, **cần khai báo trong Appendix A** (công cụ, người dùng, mục đích) và nên thay bằng ảnh patch thật khi có.
- Báo cáo cũ ghi app dùng **Machine Learning**, nhưng code hiện tại chỉ là ngưỡng độ sáng (luminance 120). Bài mới mô tả đúng theo code. Hoặc nhóm làm thật phần ML, hoặc giữ cách mô tả hiện tại.
- Báo cáo cũ ghi **push notification tự động**; MVP hiện chưa có (chỉ trả lời khi quét). Bài mới ghi đây là tầm nhìn đầy đủ.
- Thuật ngữ: báo cáo cũ dùng "stamp", "mobile application". Bài mới dùng "patch" và "web app".

## 9. Section 3 mở rộng (kiến trúc web, thuật toán, hạn chế)

- Thêm mục **Web App Architecture and Deployment** (sơ đồ luồng dữ liệu, bảng module, triển khai trên Render) và **Recognition Algorithm** (5 bước, 2 công thức) dựa trực tiếp trên code `src/lib/analyzeSticker.ts`.
- Tách **hạn chế của patch (Bảng 3.6)** và **hạn chế của web app (Bảng 3.7)**. Một số dòng là giả thuyết cần test (ví dụ: màu da ảnh hưởng độ sáng; bao bì cần chắn UV), đã ghi rõ là chưa kiểm chứng.
- Bài ghi rõ app **không dùng machine learning** và độ tin cậy **không phải xác suất thống kê**. Nếu nhóm muốn nói có ML thì phải làm thật trước.
- "Dưới 1.000 dòng code" lấy từ số dòng hiện tại (~870 dòng); cập nhật nếu code lớn hơn.

## 10. Kế hoạch ML + UV forecast (Section 3.2.5)

- Thêm mục **Planned Next Version**: bộ phân loại ML (thu dữ liệu, mô hình nhỏ chạy trên trình duyệt, so sánh với quy tắc độ sáng) và **dự báo UV theo vị trí** qua Open-Meteo (`uv_index`, `uv_index_clear_sky`), có hình 3.5. Tất cả được ghi rõ là **chưa xây dựng**.
- Nhóm cần chốt: dùng API nào (Open-Meteo hay khác), mô hình ML cụ thể, và có kịp làm trước hạn nộp không. Nếu kịp làm thật, hãy sửa mục này thành "đã làm" kèm kết quả đo; nếu không, giữ nguyên là kế hoạch.
- Open-Meteo cần API key khi dùng thương mại (theo trang tài liệu); cần kiểm tra điều khoản/chi phí trước khi bán.
- Các chỗ khác trong báo cáo vẫn nói đúng hiện trạng là heuristic.

## 11. Appendix A: dòng NHÁP để từng thành viên đối chiếu

- Mỗi thành viên có 1–2 dòng **màu đỏ [DRAFT]** gắn với đúng mục họ phụ trách (theo trang 2). Đây chỉ là khung để đối chiếu, **không phải sự thật**.
- Mỗi người phải: (1) điền tool thực tế (Claude / Gemini / ChatGPT / khác), (2) thay prompt nháp bằng prompt thật, hoặc (3) xóa dòng nếu không dùng AI. Xóa hết chữ đỏ trước khi nộp.
- Cột tool cố ý để `[CONFIRM]`, không điền sẵn tên tool.

## 12. Kết quả khảo sát (n = 40) đã đưa vào báo cáo

- `survey/results.tex` giờ là **số liệu do nhóm cung cấp** (42 phản hồi, loại 2 "Under 18", còn 40). `analyze_survey.py` không còn là nguồn của file này (chạy lại sẽ ghi đè bằng bảng khác).
- Đã kiểm tra lại toàn bộ khoảng tin cậy Wilson 95%: khớp với số đếm.
- Đã cập nhật cho thống nhất: B.5 (phần diễn giải), Section 1 (giới hạn + danh sách giả định), Section 4 (nhận xét về giá), Section 5 (kênh bán).
- **Điểm cần chú ý:** chỉ 45,0% (18/40) chịu trả từ 89.000đ trở lên và 47,5% có khả năng mua ở mức giá này. Báo cáo ghi giá 89.000đ là "giả thuyết cần kiểm tra", không phải đã được xác nhận. Nếu nhóm muốn giữ giá, cần lập luận khác; nếu hạ giá, phải sửa Section 4, 5, 6 và LTV/CAC.
- Khảo sát không đo tần suất mua lại, nên giả định "3 gói/năm" trong LTV vẫn chưa được kiểm chứng.

## 13. Appendix A đã điền theo bảng nhóm cung cấp

- Đã thay các dòng nháp đỏ bằng bảng do nhóm gửi (12 dòng). Đổi nhỏ: "TikZ/pgfplots" thành "TikZ and matplotlib" cho đúng thực tế (hình biểu đồ vẽ bằng matplotlib, không dùng pgfplots).
- Viết lại đoạn mở đầu để khớp thực tế: Claude soạn nháp nhiều mục/phụ lục và có một ảnh do AI tạo. Câu cũ "không bị AI tạo ra phần lớn" đã bỏ vì không khớp. Còn một `TODO` đỏ: nhóm cần xác nhận đoạn này.
- Chú thích Hình 3.1 ghi rõ là ảnh do AI tạo.

## 14. Section 3 cập nhật theo code/ảnh mới (UV index, ảnh mẫu, ảnh kết quả)

- Đã đọc code mới (PR #1): thẻ UV Open-Meteo (cố định TP.HCM, làm mới 15 phút, cache, cảnh báo UV ≥ 6, gợi ý khoảng quét lại theo mức UV), 4 ảnh mẫu, lịch sử mẫu, tùy chọn `?uv=9` để thử. Mục "UV forecast" đã chuyển từ kế hoạch sang "đã làm (một thành phố)"; phần chưa làm: lấy vị trí người dùng, nhắc hẹn giờ, bộ phân loại ML.
- Thêm FR-7, bảng mức UV (Bảng 3.3), mục `UV index feature`, bảng "Sample photo check" (Y và kết quả tính lại từ 4 ảnh mẫu, khớp với ảnh chụp màn hình), Hình 3.3 (Home, Scan, History) và Hình 3.4 (Result Protected/Reapply).
- **Lưu ý trung thực:** 4 ảnh mẫu do script `generate_sample_photos.py` vẽ ra, **không phải ảnh patch thật**. Bài ghi rõ đây chỉ kiểm tra app chạy đúng, không đo độ chính xác. Không dùng bảng này như kết quả "chỉnh ngưỡng".
- Các khoảng thời gian quét lại (45/60/90/120 phút) là lựa chọn thiết kế của nhóm, chưa có nguồn; bài ghi rõ là chưa kiểm chứng.
- Ảnh chụp lúc 19:30 nên thẻ UV hiện "Sun is down"; bạn có thể chụp lại ban ngày (hoặc dùng `?uv=9`) để thấy cảnh báo UV cao nếu muốn.
- Số dòng code: ~1.500 (đã sửa từ "dưới 1.000").
