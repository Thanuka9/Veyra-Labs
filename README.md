# Veyra Labs — Software & AI Engineering Studio Website

Veyra Labs is a premium, conversion-engineered digital storefront for a modern Software & AI engineering studio. It showcases interactive portfolios, dynamic project estimators, client testimonials, and a custom-designed AI-like chat helper, all styled in a premium dark-themed design with smooth micro-animations.

---

## 🚀 Key Features

* **3D Mouse-Tracking Cards**: Visual wow-factor on grid items with custom mouse-tracking spot glows and 3D tilts.
* **Interactive Estimate Wizard**: An integrated step-by-step cost estimator that allows prospects to configure projects, calculate ballpark pricing, and receive detailed estimates in real time.
* **Premium HTML Email & PDF generation**: Integrates client-side PDF compilation using `jspdf` and outbound email attachments using `emailjs` under a self-healing compression fallback to bypass free-tier size limits.
* **Responsive Layouts**: Silky smooth mobile layout and responsive snap-carousels for Optional Enhancements.
* **Legal Compliance**: Full cookies consent controller, customized privacy policy, terms of service, and sitemaps/robots configurations.

---

## 🛠️ Technology Stack

* **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & CSS Variables
* **Animations**: [Framer Motion](https://www.framer.com/motion/) & CSS keyframe overrides
* **Email & Integrations**: [@emailjs/browser](https://www.emailjs.com/)
* **PDF Engine**: [jspdf](https://rawgit.com/MrRio/jsPDF/master/docs/index.html)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```
veyra-labs-site/
├── public/                 # Brand assets, project screenshots, and custom vectors
└── src/
    ├── app/                # Next.js App Router pages (Home, Terms, Privacy, Cookies)
    ├── components/         # Premium React components (Hero, Navbar, Pricing, Services, Chat)
    └── lib/                # Modular utilities (EmailJS configs, PDF builders, content states)
```

---

## 💻 Getting Started

### 1. Installation

Install all package dependencies in the `web` directory:

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory and add your EmailJS public credentials if you wish to enable active outbound estimates:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_your_service_id
NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID=template_neuqpqj
NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID=template_69hvz1j
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_new_public_key
```

Use **only** the EmailJS Public Key in this project. Never add the Private Key to GitHub, Vercel client variables, or any `NEXT_PUBLIC_...` / frontend code.

### 3. Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

### 4. Production Build

Verify the Next.js build compilation and static optimization:

```bash
npm run build
```

---

## 🌐 Deployment on Vercel

Since this is a client-side static Next.js project, it can be deployed directly to Vercel:

1. Connect your repository (`Thanuka9/Veyra-Labs`) to Vercel.
2. Select the `/web` subdirectory as the root directory.
3. Configure your Environment Variables in the Vercel dashboard.
4. Click **Deploy**.
