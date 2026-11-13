'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                చ
              </div>
              <span className="text-white font-bold text-base">
                {t('ప్రతి బిడ్డ చదవాలి (Every Child Reads)', 'Every Child Reads - Telugu AI')}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {t(
                'ప్రభుత్వ ప్రాథమిక పాఠశాల విద్యార్థుల తెలుగు భాషా పఠన సామర్థ్యాలను AI ద్వారా విశ్లేషించి, తడబాటు మరియు ఉచ్చారణ దోషాలను గుర్తించి, వ్యక్తిగతీకరించిన అభ్యాస ప్రణాళికను అందించే జాతీయ విద్యా విప్లవం.',
                'AI SaaS platform assessing Telugu reading abilities of primary school children, identifying phonemic weaknesses, and generating tailored learning paths under FLN / NIPUN Bharat standards.'
              )}
            </p>
            <div className="mt-4 flex items-center gap-3 text-slate-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {t('DPDP చట్టం & పిల్లల రక్షణ నిబంధనలు సమ్మతం', 'DPDP Act & Child Data Protection Compliant')}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t('ముఖ్య విభాగాలు', 'Core Modules')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/reading-studio" className="hover:text-white transition">
                  {t('లైవ్ పఠన స్టూడియో (Reading Studio)', 'Live Reading Studio')}
                </a>
              </li>
              <li>
                <a href="/assessment-result" className="hover:text-white transition">
                  {t('AI ఉచ్చారణ నిర్ధారణ (AI Diagnostics)', 'AI Diagnostic Matrix')}
                </a>
              </li>
              <li>
                <a href="/practice" className="hover:text-white transition">
                  {t('అక్షర సాధన & గేమ్స్ (Practice Studio)', 'Personalized Word Drills')}
                </a>
              </li>
              <li>
                <a href="/teacher" className="hover:text-white transition">
                  {t('ఉపాధ్యాయుల డాష్‌బోర్డ్ (Teacher LMS)', 'Teacher Classroom Hub')}
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-white transition">
                  {t('జిల్లా & రాష్ట్ర స్థాయి విశ్లేషణ (State Analytics)', 'District & State Metrics')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t('విద్యా ప్రమాణాలు', 'Academic Standards')}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>• SCERT తెలంగాణ / ఏపీ తెలుగు పాఠ్యపుస్తకాలు</li>
              <li>• NIPUN Bharat - FLN లక్ష్యాలు (30-60 WCPM)</li>
              <li>• గుణింతాలు & సంయుక్తాక్షర ఫోనెమిక్ ఎనాలిసిస్</li>
              <li>• ఆడియో ఎన్క్రిప్షన్ & సమ్మతి విధానం</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 {t('ప్రతి బిడ్డ చదవాలి - పాఠశాల విద్యాశాఖ భాగస్వామ్యంతో.', 'Every Child Reads Initiative. In partnership with School Education Dept.')}
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">{t('గోప్యతా విధానం (Privacy)', 'Privacy Policy')}</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('నిబంధనలు (Terms)', 'Terms of Service')}</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('సహాయ కేంద్రం (Helpdesk)', 'Support & Grievances')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

