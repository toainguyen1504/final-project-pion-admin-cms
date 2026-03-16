# Optimize:
- ROUTE:  Dùng <Route path="/categories/:type" element={<CategoryPage />} /> thay cho cách tổ chức hiện tại (nếu sau mở rộng thêm post category)

- USER: Tạo acccount chỉ nên để Tên và Role là bắt buộc, password và username tự động render -> sau đó gửi account cho người dùng -> người dùng sẽ tự Edit lại profile
 + Nhấn tạo account -> render component account
 + Ở admin cms -> cung cấp UI đơn giản để tạo account -> việc đổi mật khẩu sẽ ở Client (staff, teacher, learner là có thể chỉnh sửa profile )

 + admin chỉ có thể thêm account
 + super admin -> quản lý toàn hệ thống, hỗ trợ web 


# nên dùng hook DEBOUNDCE, ví dụ useDebounce(value, delay)

#### Vấn đề lớn - cải thiện sau khi xong Elearning
# Duplicate logic lớn ở table: selectedIds, deleteMode, deleteDialog, search debounce, column visibility,...
    -> nên refactor thành: shared/table/DataTable, dataTable có: TableToolbar, TableHeader, TableBody, Pagination
    -> Sau đó mỗi module chỉ cần: columns, row renderer, api delete -> Giảm code ~2000 dòng → 400 dòng.

# refactor Form state: nên dùng -> formData

# Pagination nên cải thiện
- hiện tại đang là: 1 2 3 4 5 6 7 8 9 10. -> chuyển sang dạng 1 ... 5 6 7 ... 200

# Performance risk
- Flashcard table có thể có: 10k flashcards -> Table render sẽ nặng -> nên dùng TanStack Table + virtualization

# Kiến trúc hiện tại -> enterprise React architecture.