import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 safe-top">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors mb-6"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-50 mb-2">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mb-8">Last updated: June 30, 2026</p>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-slate-100 mb-2">1. Overview</h2>
            <p>
              Smart Academy is an educational platform for IHK exam preparation developed by Aryan Barakzai.
              This Privacy Policy explains what data we collect, how we use it, and your rights.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100 mb-2">2. Data We Collect</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Learning progress: stored locally on your device</li>
              <li>AI queries: sent to Google Gemini API, not stored beyond active session</li>
              <li>Language preference: stored locally</li>
              <li>We do NOT collect name, email, location, or sell data to third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100 mb-2">3. Third-Party Services</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Google Gemini API (AI features)</li>
              <li>Supabase (optional account/sync)</li>
              <li>Cloudflare (hosting)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100 mb-2">4. Your Rights (GDPR)</h2>
            <p>
              Right to access, deletion, correction, and portability.
              Contact: <a href="mailto:barakzahi@web.de" className="text-blue-400 hover:text-blue-300 underline">barakzahi@web.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-100 mb-2">5. Contact</h2>
            <p>Aryan Barakzai</p>
            <p>Email: <a href="mailto:barakzahi@web.de" className="text-blue-400 hover:text-blue-300 underline">barakzahi@web.de</a></p>
            <p>Website: <a href="https://academy.barakzai.cloud" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline">https://academy.barakzai.cloud</a></p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
