import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '../components/auth/Logo';

const SECTIONS = [
{
  id: 'data-protection',
  title: 'Data Protection',
  body: [
  'AI Vital is designed to process health surveillance data in line with Law Nº 058/2021 of 13/10/2021 relating to the protection of personal data and privacy in Rwanda.',
  'Surveillance views use aggregated, de-identified counts. Case-level records stay in the source systems (DHIS2, RBC laboratory, CHW reporting).',
  'Access is role-based (DHO, Epidemiologist, Analyst, Integration, Administrator) and every action is written to the audit trail.']
},
{
  id: 'privacy',
  title: 'Privacy Policy',
  body: [
  'Account data (name, work email, phone, institution, role and district) is used only to grant access and to deliver alerts.',
  'Alert notifications are sent only to users whose role and district match the alert.',
  'Users can view their own profile and activity from the Profile page.']
},
{
  id: 'terms',
  title: 'Terms of Service',
  body: [
  'AI Vital is a decision-support tool. AI risk scores and alerts must be reviewed by qualified public health staff before action is taken.',
  'Accounts are personal and must not be shared. Access is granted by the system administrator after approval.']
}];


export function Legal() {
  const { hash } = useLocation();
  useEffect(() => {
    // wait one tick so the section exists before scrolling to it
    if (hash) window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [hash]);

  return (
    <div className="min-h-screen bg-section py-12 px-6 font-sans">
      <div className="max-w-[760px] mx-auto bg-white rounded-xl shadow-card p-8 sm:p-10">
        <Link to="/"><Logo className="mb-8" /></Link>
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h1 className="text-[26px] font-bold text-text-primary">Security &amp; Trust</h1>
        </div>
        <p className="text-[13px] text-text-secondary bg-page border border-border rounded-lg px-4 py-3 mb-8">
          Prototype placeholder. These summaries describe the intended policies; the official documents will be
          issued by Rwanda Biomedical Centre.
        </p>
        {SECTIONS.map((s) =>
        <section key={s.id} id={s.id} className="mb-8 scroll-mt-6">
            <h2 className="text-[18px] font-bold text-text-primary mb-3">{s.title}</h2>
            <ul className="list-disc pl-5 space-y-2 text-[14px] text-text-secondary">
              {s.body.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </section>
        )}
        <Link to="/" className="text-[14px] font-semibold text-primary hover:underline">← Back to home</Link>
      </div>
    </div>);

}
