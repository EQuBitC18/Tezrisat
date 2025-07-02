# Tezrisat Payment Setup

This project uses Stripe for payments. The following environment variables are required before running the backend and frontend:

```
# .env example
DJANGO_SECRET_KEY=changeme
STRIPE_SECRET_KEY=sk_test_yourkey
STRIPE_PUBLIC_KEY=pk_test_yourkey
STRIPE_WEBHOOK_SECRET=whsec_yoursecret
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_yourkey
VITE_PAYMENT_RETURN_URL=http://localhost:5173/success
```

Copy `.env.example` to `.env` and supply real values when deploying.
