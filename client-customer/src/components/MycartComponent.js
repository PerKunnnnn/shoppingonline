import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext; // using this.context to access global state
  render() {
    const mycart = this.context.mycart.map((item, index) => {
      return (
        <tr key={item.product._id} className="datatable">
          <td>{index + 1}</td>
          <td>{item.product._id}</td>
          <td>{item.product.name}</td>
          <td>{item.product.category.name}</td>
          <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
          <td>{item.product.price}</td>
          <td>{item.quantity}</td>
          <td>{item.product.price * item.quantity}</td>
          <td><span className="link" onClick={() => this.lnkRemoveClick(item.product._id)}>Xóa sản phẩm</span></td>
          <td><span className="link" onClick={() => this.lnkCheckoutClick()}>Thanh toán</span></td>
        </tr>
      );
    });
    return (
      <div className="align-center">
        <h2 className="text-center">Danh sách sản phẩm trong giỏ hàng</h2>
        <table className="datatable" border="1">
          <tbody>
            <tr className="datatable">
              <th>Số thứ tự</th>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Dòng sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Số tiền</th>
              <th>Hành động</th>
            </tr>
            {mycart}
            <tr>
              <td colSpan="6"></td>
              <td>Tổng</td>
              <td>{CartUtil.getTotal(this.context.mycart)}</td>
              {/* <td><span className="link">Tiến hành thanh toán</span></td> */}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
    // event-handlers
    lnkCheckoutClick() {
        if (window.confirm('Bạn có chắc là muốn thanh toán?')) {
          if (this.context.mycart.length > 0) {
            const total = CartUtil.getTotal(this.context.mycart);
            const items = this.context.mycart;
            const customer = this.context.customer;
            if (customer) {
              this.apiCheckout(total, items, customer);
            } else {
              this.props.navigate('/login');
            }
          } else {
            alert('Giỏ hàng đang rỗng');
          }
        }
      }
      lnkRemoveClick(id) {
        const mycart = this.context.mycart;
        const index = mycart.findIndex(x => x.product._id === id);
        if (index !== -1) { // found, remove item
          mycart.splice(index, 1);
          this.context.setMycart(mycart);
        }
      }  
      // apis
      apiCheckout(total, items, customer) {
        const body = { total: total, items: items, customer: customer };
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.post('/api/customer/checkout', body, config).then((res) => {
          const result = res.data;
          if (result) {
            alert('Thanh toán thành công!');
            this.context.setMycart([]);
            this.props.navigate('/home');
          } else {
            alert('Thành toán không thành công!');
          }
        });
    }
}
export default withRouter(Mycart);