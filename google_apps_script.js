/**
 * GOOGLE APPS SCRIPT CHO THIỆP CƯỚI BÍCH DUYÊN & VIỆT TIẾN
 * Hướng dẫn:
 * 1. Mở file Google Sheet mới của bạn.
 * 2. Menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa hết mã cũ và dán toàn bộ đoạn mã này vào.
 * 4. Bấm "Lưu" (biểu tượng đĩa mềm).
 * 5. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment).
 *    - Chọn loại: Ứng dụng web (Web app).
 *    - Mô tả: Thiệp Cưới API.
 *    - Thực thi dưới dạng (Execute as): Tôi (Me).
 *    - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone).
 * 6. Bấm "Triển khai", cấp quyền nếu được hỏi, rồi copy đường link Web App URL.
 * 7. Mở admin.html -> Bấm "Cấu hình Google Sheet" -> Dán link này vào.
 */

function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["STT", "Tên Khách Mời", "Link Thiệp Cưới", "Trạng Thái", "Thời Gian Gửi"]);
    var headerRange = sheet.getRange(1, 1, 1, 5);
    headerRange.setBackground("#c9a227");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

// 1. Nhận yêu cầu GET: Lấy toàn bộ danh sách khách về web
function doGet(e) {
  setupHeaders();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var guests = [];

  // Bỏ qua dòng tiêu đề (hàng 0)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var name = row[1];
    if (name) {
      guests.push({
        name: String(name).trim(),
        link: row[2] || "",
        copied: String(row[3]).toLowerCase().indexOf("đã") !== -1 || String(row[3]).toLowerCase().indexOf("da") !== -1,
        copiedAt: row[4] ? String(row[4]) : ""
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify(guests))
    .setMimeType(ContentService.MimeType.JSON);
}

// 2. Nhận yêu cầu POST: Cập nhật trạng thái 'Đã copy' hoặc thêm khách mới
function doPost(e) {
  setupHeaders();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;

    if (action === "mark_copied") {
      var guestName = String(postData.name || "").trim().toLowerCase();
      var copiedAt = postData.copiedAt || new Date().toLocaleString("vi-VN");
      var data = sheet.getDataRange().getValues();

      for (var i = 1; i < data.length; i++) {
        if (String(data[i][1]).trim().toLowerCase() === guestName) {
          sheet.getRange(i + 1, 4).setValue("Đã gửi");
          sheet.getRange(i + 1, 5).setValue(copiedAt);
          return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }

      // Nếu chưa có tên trong sheet thì thêm dòng mới
      var newStt = sheet.getLastRow();
      sheet.appendRow([newStt, postData.name, "", "Đã gửi", copiedAt]);
    } 
    else if (action === "add_guests") {
      var guestsList = postData.guests || [];
      var data = sheet.getDataRange().getValues();
      var existingNames = [];
      for (var i = 1; i < data.length; i++) {
        existingNames.push(String(data[i][1]).trim().toLowerCase());
      }

      for (var j = 0; j < guestsList.length; j++) {
        var g = guestsList[j];
        var clean = String(g.name).trim();
        if (clean && existingNames.indexOf(clean.toLowerCase()) === -1) {
          var nextStt = sheet.getLastRow();
          sheet.appendRow([
            nextStt,
            clean,
            g.link || "",
            g.copied ? "Đã gửi" : "Chưa gửi",
            g.copiedAt || ""
          ]);
          existingNames.push(clean.toLowerCase());
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

