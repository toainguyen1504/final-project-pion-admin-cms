# Note

Optimize:
- ROUTE:  Dùng <Route path="/categories/:type" element={<CategoryPage />} /> thay cho cách tổ chức hiện tại (nếu sau mở rộng thêm post category)

- USER: Tạo acccount chỉ nên để Tên và Role là bắt buộc, password và username tự động render -> sau đó gửi account cho người dùng -> người dùng sẽ tự Edit lại profile
 + Nhấn tạo account -> render component account
 + Ở admin cms -> cung cấp UI đơn giản để tạo account -> việc đổi mật khẩu sẽ ở Client (staff, teacher, learner là có thể chỉnh sửa profile )

 + admin chỉ có thể thêm account
 + super admin -> quản lý toàn hệ thống, hỗ trợ web 
