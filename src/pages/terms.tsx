import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import { SITE_CONFIG } from '@/lib/constants';

const TermsOfService: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Terms of Service | {SITE_CONFIG.name}</title>
        <meta name="description" content="Terms of Service for TrendLensX - Read our terms and conditions for using our website and services." />
        <meta property="og:title" content={`Terms of Service | ${SITE_CONFIG.name}`} />
        <meta property="og:description" content="Terms of Service for TrendLensX - Read our terms and conditions for using our website and services." />
        <meta property="og:type" content="website" />
      </Head>

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                Welcome to TrendLensX. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                TrendLensX is a news and information platform that provides content related to technology, finance, education, sports, lifestyle, jobs, and scholarships. Our services include website access, newsletter subscriptions, and related features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 mb-4">
                To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Account Responsibilities</h3>
              <p className="text-gray-700 mb-4">
                You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate and complete information</li>
                <li>Keep your account information updated</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Use your account only for lawful purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-700 mb-4">
                You agree not to use our services to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious code</li>
                <li>Harass, threaten, or abuse others</li>
                <li>Post spam or unsolicited commercial content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">5. Content and Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Our Content</h3>
              <p className="text-gray-700 mb-4">
                All content on TrendLensX, including text, graphics, logos, and software, is owned by us or our licensors and is protected by copyright and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 User-Generated Content</h3>
              <p className="text-gray-700 mb-4">
                By posting content on our platform, you grant us a non-exclusive, royalty-free license to use, modify, and distribute your content in connection with our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">6. Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our <Link href="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>, which also governs your use of our services, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">7. Disclaimers</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Service Availability</h3>
              <p className="text-gray-700 mb-4">
                We strive to provide reliable services but cannot guarantee uninterrupted or error-free operation. We reserve the right to modify or discontinue services at any time.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Content Accuracy</h3>
              <p className="text-gray-700 mb-4">
                While we make efforts to provide accurate information, we do not warrant the accuracy, completeness, or timeliness of any content. Users should verify information independently.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, TrendLensX shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold TrendLensX harmless from any claims, losses, or damages arising from your use of our services or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to our services at our discretion, with or without cause, and with or without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or website notice. Continued use of our services constitutes acceptance of updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> {SITE_CONFIG.contact.email}</p>
                <p className="text-gray-700"><strong>Phone:</strong> {SITE_CONFIG.contact.phone}</p>
                <p className="text-gray-700"><strong>Address:</strong> {SITE_CONFIG.contact.address}</p>
              </div>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;