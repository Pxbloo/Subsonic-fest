import React from 'react';
import Input from './Input';
import Button from './Button';
import gpayLogo from '@/assets/icons/Google_Pay_Logo.svg.webp';
import applePayLogo from '@/assets/icons/Apple_Pay_logo.svg.webp';
import paypalLogo from '@/assets/icons/PayPal.svg.webp';
import bizumLogo from '@/assets/icons/Bizum.webp';

const PaymentForm = ({ onSubmit, isLoading, totalAmount }) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <Button
          type="button"
          variant="payment"
          className="h-10 w-28"
        >
          <img src={gpayLogo} alt="Google Pay" className="h-5 object-contain" />
        </Button>
        <Button
          type="button"
          variant="payment"
          className="h-10 w-28"
        >
          <img src={applePayLogo} alt="Apple Pay" className="h-5 object-contain" />
        </Button>
        <Button
          type="button"
          variant="payment"
          className="h-10 w-28"
        >
          <img src={paypalLogo} alt="PayPal" className="h-5 object-contain" />
        </Button>
        <Button
          type="button"
          variant="payment"
          className="h-10 w-28"
        >
          <img src={bizumLogo} alt="Bizum" className="h-5 object-contain" />
        </Button>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-subsonic-muted">
        <div className="flex-1 h-px bg-subsonic-border" />
        <span className="uppercase tracking-[0.25em] text-center">o añade método de pago</span>
        <div className="flex-1 h-px bg-subsonic-border" />
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Email*"
          name="email"
          placeholder="johndoe@example.com"
          type="email"
          required
        />

        <div className="space-y-2">
          <p className="text-[10px] font-montserrat text-subsonic-muted uppercase tracking-[0.25em]">Detalles de la tarjeta</p>
          <Input
            label="Número de tarjeta*"
            name="card"
            placeholder="1234 1234 1234 1234"
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="MM*"
              name="expiryMonth"
              placeholder="MM"
              required
            />
            <Input
              label="YY*"
              name="expiryYear"
              placeholder="YY"
              required
            />
            <Input
              label="CVC*"
              name="cvc"
              type="password"
              placeholder="CVC"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-montserrat text-subsonic-muted uppercase tracking-[0.25em]">Titular</p>
          <Input
            label="Nombre del titular*"
            name="holder"
            placeholder="John Doe"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full mt-4 disabled:bg-subsonic-muted tracking-widest text-xs"
        >
          {isLoading ? 'Procesando...' : `Pagar ${totalAmount || ''}`}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;