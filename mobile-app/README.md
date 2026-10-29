# Shree Finance Mobile App (Expo & React Native)

Official mobile application for **Shree Finance** — India's Premier Multi-Bank Digital Lending Marketplace. Built using Expo SDK 58, Expo Router, and React Native.

---

## 📱 Features Included

1. **Home Screen (`/`)**:
   - Official Shree Finance branding with header logo and fast helpline call integration (`+91 88304 34945`).
   - Hero banner with 30-min instant approval callouts, live rates ticker, and key metrics (2,100+ approvals, 99% satisfaction, 40+ banks).
   - Six loan product categories: Home Loan, Personal Loan, Loan vs Property, Car Loan, Business Loan, and Education Loan.
   - Interactive Quick EMI estimator with dynamic amount presets.
   - Bank partners showcase (SBI, HDFC, ICICI, YES Bank, Axis Bank, Shree Finance Direct).
   - Real customer testimonials (Akash Jadhav, Siddhi Bhoite, Aishwarya Sulagadle).
   - Direct contact & Pune Narhe office details.

2. **EMI & Wealth Calculators (`/calculator`)**:
   - Multi-calculator tabs: **Loan EMI**, **SIP Wealth**, **Fixed Deposit (FD)**, and **Recurring Deposit (RD)**.
   - Instant dynamic calculations, amount presets (₹5L, ₹10L, ₹25L, ₹50L, ₹1Cr), and rate/tenure adjustment steppers.
   - Visual payment breakdown showing Principal, Total Interest Payable, and Total Amount.
   - "Apply for this EMI" one-tap action.

3. **Live Bank Comparison Matrix (`/compare`)**:
   - Live interest rate comparison across top lending institutions (Shree Finance Direct, SBI, YES Bank, HDFC, ICICI, Axis).
   - Filters for Home Loan, Personal Loan, and Business Loan.
   - Highlights processing fees, maximum tenures, and special perks.
   - Direct per-bank application trigger.

4. **Application Tracker (`/track`)**:
   - Real-time application tracking using Application Reference ID (e.g., `SF-2026-8942`, `Shree_Finence_01`) or Mobile Number.
   - Interactive 5-stage progress timeline:
     1. Application Submitted
     2. Document & KYC Verification
     3. Property & Technical Valuation
     4. Loan Sanction Letter Issued
     5. Final Bank Disbursal
   - Assigned Relationship Manager card with direct dial (`Sarvesh Bhoite`).

5. **DSA Partner Program (`/partner`)**:
   - Channel Partner onboarding & benefits (up to 2.5% slab payouts, direct bank codes, dedicated RM, CRM dashboard).
   - Interactive Partner Onboarding Registration Form with instant Partner ID generation (`SF-DSA-XXX`).

6. **Lead & CIBIL Check Modal**:
   - Reusable bottom sheet modal for instant paperless loan applications and free CIBIL credit score checks.

---

## 🚀 Running the Mobile App

Navigate into the mobile app directory:

```bash
cd mobile-app
```

### Start Expo Metro Development Server
```bash
npx expo start
```

### Run on Android
```bash
npx expo run:android
# or via Expo Go:
npx expo start --android
```

### Run on iOS
```bash
npx expo run:ios
# or via Expo Go:
npx expo start --ios
```

### Run on Web
```bash
npx expo start --web
```
