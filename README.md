# Xây dựng BE quản lý khách hàng tiềm năng

- Yêu cầu :

* Chức năng đăng nhập
* Ứng dụng dành riêng cho người dùng admin, có thể có thêm phân quyền cho cấp dưới - đồng nghiệp
* Cho xép nhập và xuất file execl theo data của khách hàng
* Theo dõi thông tin khách hàng , đánh dấu độ ưu tiên khách hàng (Phục vụ trước , phục vụ sau)
* Có thêm logic note ghi chú thông tin khách hàng , có thể chỉnh sửa CRUD các thông tin của một khách hàng
* Mô hình quản khách hàng tư vấn du học
  ==> Một khách hàng có thể chỉ là một khách hàng duy nhất mà không mở rộng
  ==> Một khách hàng có thể có thể là phụ huynh của nhiều học sinh / bạn bè / họ hàng
* Yêu cầu dữ cần đúng chuẩn theo metadata vì vể sau có thể mở rộng sang nhiều user , Mỗi user sẽ có một tệp khách hàng riêng đó của họ

* Yêu cầu với đầu đủ các chức năng import file Excel , tạo file mẫu , và xuất ra một file execl
* Cần có một mục cài đặt hệ thống , cơ chế quyên mật khẩu , điền thông tin cá nhân , tránh cho người dùng quên mật khẩu và không đăng nhập được vào hệ thống

- Cài đặt các công nghệ , thư viện liên quan :

* ExpressJs , MongoDB , restful api

- các thư viện cần tải xem trong package.json

- Cài đặt backend :

* clone link github :
* cd backend
* npm install
* npm run dev

# Nhật ký làm

- 30/06/2025 ==> Xong tính năng đăng nhập , crud user , dở phần profile
  -Cần xác định rõ các trường dữ liệu cần cho collection Customer;
- Sau cần nghiên cứu thêm phần nhập xuất execel để tiện lợi hơn cho người sử dụng

- 30/06/2025 ==> Đã xong phần đăng nhập , profile user , chốt xong trường dữ liệu customer
