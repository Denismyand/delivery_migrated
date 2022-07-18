import { useRef } from "react";
import { CopyButton } from "../components/MuiCustomized.js";
import { useAppContext } from "../context/state.js";

export default function Coupons() {
  const { createNotification } = useAppContext();
  const refTwenty = useRef(null);
  const refThirty = useRef(null);

  return (
    <div className="CouponsContent">
      <h1>Your coupons</h1>
      <div className="CouponsList">
        <div className="Coupon">
          <img
            className="CouponImg"
            src="https://res.cloudinary.com/nvmate/image/upload/v1658159920/delivery/Screenshot_2_zt7dxi.png"
            alt="20% off coupon"
          />
          <textarea
            className="CouponCode"
            ref={refTwenty}
            value={"20percent"}
            disabled={true}
          />
          <CopyButton
            onClick={() => {
              navigator.clipboard.writeText(refTwenty.current.value);
              createNotification("copied");
            }}
          >
            <b>Copy code</b>
          </CopyButton>
        </div>
        <div className="Coupon">
          <img
            className="CouponImg"
            src="https://res.cloudinary.com/nvmate/image/upload/v1658159920/delivery/Screenshot_3_eho2ns.png"
            alt="30% off coupon"
          />
          <textarea
            className="CouponCode"
            ref={refThirty}
            value={"30percent"}
            disabled={true}
            height="20px"
            width="50px"
          />
          <CopyButton
            onClick={() => {
              navigator.clipboard.writeText(refThirty.current.value);
              createNotification("copied");
            }}
          >
            <b>Copy code</b>
          </CopyButton>
        </div>
      </div>
    </div>
  );
}
