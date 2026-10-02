import React, { useEffect, useState } from 'react';
import { WarningLayout } from '../../components/warning/WarningLayout';
import { useApp } from '../../store/AppStore';
import { SEVERITY_META, isOpenStatus } from '../../lib/format';
import type { AlertRules, Severity, Threshold } from '../../types';

function Toggle({ on, onChange, label }: {on: boolean;onChange: (v: boolean) => void;label: string;}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${on ? 'bg-[#00A550]' : 'bg-border'}`}>

      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${on ? 'right-1' : 'left-1'}`} />
    </button>);

}

export function WarningConfig() {
  const { state, actions } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Pick<Threshold, 'yellow' | 'orange' | 'red'>>({ yellow: 0, orange: 0, red: 0 });
  const [rules, setRules] = useState<AlertRules>(state.rules);
  const dirty = JSON.stringify(rules) !== JSON.stringify(state.rules);

  useEffect(() => setRules(state.rules), [state.rules]);

  const startEdit = (t: Threshold) => {
    setEditing(t.disease);
    setDraft({ yellow: t.yellow, orange: t.orange, red: t.red });
  };
  const valid = draft.yellow <= draft.orange && draft.orange <= draft.red;

  // Preview: which level the highest current open alert for this disease would get
  const preview = (disease: string): {cases: number;district: string;level: Severity;} | null => {
    const a = state.alerts.
    filter((x) => x.disease === disease && isOpenStatus(x.status)).
    sort((x, y) => y.cases - x.cases)[0];
    if (!a) return null;
    const level: Severity =
    a.cases >= draft.red ? 'red' : a.cases >= draft.orange ? 'orange' : a.cases >= draft.yellow ? 'yellow' : 'green';
    return { cases: a.cases, district: a.district, level };
  };

  const set = <K extends keyof AlertRules,>(k: K, v: AlertRules[K]) => setRules((r) => ({ ...r, [k]: v }));
  const num = (v: string) => Math.max(0, Number(v) || 0);

  return (
    <WarningLayout
      title="Alert Configuration"
      subtitle="Set rules for when AI Vital generates warnings — Administrator only"
      breadcrumb="Alert Configuration">

      <div className="bg-epi-amber/10 border border-epi-amber/30 p-4 rounded-lg mb-6 flex items-start gap-3">
        <span className="text-[20px]">⚙️</span>
        <div className="text-[13px] text-epi-text leading-relaxed">
          Changes to alert thresholds affect all 30 districts and all 5 user roles. They apply to the
          next prediction run and are logged in the audit trail.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-[16px] font-bold text-epi-text">Alert Thresholds by Disease</h2>
              <p className="text-[13px] text-epi-muted mt-1">Cases per week (district level) to trigger each level</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-epi-bg border-b border-border">
                    {['Disease', '🟡 Yellow', '🟠 Orange', '🔴 Red', 'Unit', 'Last Updated', 'Edit'].map((h, i) =>
                    <th
                      key={h}
                      className={`p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${i >= 1 && i <= 3 ? 'text-center' : ''} ${i === 6 ? 'text-right' : ''}`}>

                        {h}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {state.thresholds.map((t) => {
                    if (editing === t.disease) {
                      const p = preview(t.disease);
                      return (
                        <tr key={t.disease} className="bg-epi/5">
                          <td colSpan={7} className="p-4">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[14px] font-bold text-epi-text">{t.disease}</span>
                                <span className="text-[12px] text-epi-muted">{t.unit}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                {(['yellow', 'orange', 'red'] as const).map((lvl) =>
                                <div key={lvl}>
                                    <label className={`block text-[12px] font-bold mb-1 ${SEVERITY_META[lvl].text}`}>
                                      {SEVERITY_META[lvl].emoji} {SEVERITY_META[lvl].label}
                                    </label>
                                    <input
                                    type="number"
                                    min={0}
                                    value={draft[lvl]}
                                    onChange={(e) => setDraft((d) => ({ ...d, [lvl]: num(e.target.value) }))}
                                    className="w-full p-2 border border-border rounded text-[13px] focus:outline-none focus:border-epi" />

                                  </div>
                                )}
                              </div>
                              {!valid &&
                              <div className="text-[12px] text-epi-red font-medium">
                                  Thresholds must increase: Yellow ≤ Orange ≤ Red.
                                </div>
                              }
                              <div className="text-[12px] text-epi-muted italic">
                                {p ?
                                <>
                                    Preview: at the current {p.district} level ({p.cases}), this rule would trigger:{' '}
                                    <span className={`font-bold ${SEVERITY_META[p.level].text}`}>
                                      {SEVERITY_META[p.level].emoji} {SEVERITY_META[p.level].label}
                                    </span>
                                  </> :

                                'Preview: no open alerts for this disease right now.'
                                }
                              </div>
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => setEditing(null)}
                                  className="px-4 py-1.5 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">

                                  Cancel
                                </button>
                                <button
                                  disabled={!valid}
                                  onClick={() => {
                                    actions.updateThreshold(t.disease, draft);
                                    setEditing(null);
                                  }}
                                  className="px-4 py-1.5 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark disabled:opacity-50 transition-colors">

                                  Save Changes
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>);

                    }
                    const pct = t.unit.startsWith('%');
                    return (
                      <tr key={t.disease} className="hover:bg-epi-bg/50">
                        <td className="p-3 text-[13px] font-bold text-epi-text">{t.disease}</td>
                        <td className="p-3 text-[13px] text-epi-text text-center">{t.yellow}{pct ? '%' : ''}</td>
                        <td className="p-3 text-[13px] text-epi-text text-center">{t.orange}{pct ? '%' : ''}</td>
                        <td className="p-3 text-[13px] text-epi-text text-center">{t.red}{pct ? '%' : ''}</td>
                        <td className="p-3 text-[13px] text-epi-muted">{t.unit}</td>
                        <td className="p-3 text-[13px] text-epi-muted">{t.updated}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => startEdit(t)} className="text-[13px] text-epi hover:underline">
                            Edit ✏️
                          </button>
                        </td>
                      </tr>);

                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text">Advanced Alert Rules</h2>
            <p className="text-[13px] text-epi-muted mb-6">Rules beyond simple case count thresholds</p>

            <div className="space-y-4">
              <Rule
                title="Rule 1: Growth Rate Rule"
                on={rules.growthEnabled}
                onToggle={(v) => set('growthEnabled', v)}
                desc={`Trigger 🟠 Orange if cases grow more than ${rules.growthPct}% in one week, regardless of count`}>

                <NumberInput label="Threshold (%)" value={rules.growthPct} onChange={(v) => set('growthPct', v)} />
              </Rule>
              <Rule
                title="Rule 2: AI Probability Rule"
                on={rules.aiEnabled}
                onToggle={(v) => set('aiEnabled', v)}
                desc={`Trigger 🟠 Orange if AI predicts ≥${rules.aiPct}% outbreak probability (🔴 Red at ≥${Math.min(100, rules.aiPct + 20)}%)`}>

                <NumberInput label="Threshold (%)" value={rules.aiPct} onChange={(v) => set('aiPct', Math.min(90, v))} />
              </Rule>
              <Rule
                title="Rule 3: Doubling Time Rule"
                on={rules.doublingEnabled}
                onToggle={(v) => set('doublingEnabled', v)}
                desc={`Trigger 🔴 Red if cases double faster than ${rules.doublingDays} days`}>

                <NumberInput label="Threshold (days)" value={rules.doublingDays} onChange={(v) => set('doublingDays', v)} />
              </Rule>
              <Rule
                title="Rule 4: Cross-Border Rule"
                on={rules.crossBorderEnabled}
                onToggle={(v) => set('crossBorderEnabled', v)}
                desc="Trigger 🟡 Yellow automatically in border districts when a neighbouring country reports an outbreak">

                <div className="text-[11px] text-epi-muted italic">
                  Border districts: Rusizi, Rubavu, Nyamasheke, Burera, Musanze, Kirehe, Ngoma
                </div>
              </Rule>
              <Rule
                title="Rule 5: Rainy Season Multiplier"
                on={rules.rainyEnabled}
                onToggle={(v) => set('rainyEnabled', v)}
                desc="Lower malaria and waterborne thresholds by 30% during rainy seasons (March–May, October–December)">

                <div className={`text-[12px] font-bold ${rules.rainyEnabled ? 'text-epi' : 'text-epi-muted'}`}>
                  🌧️ Rainy season multiplier currently {rules.rainyEnabled ? 'ACTIVE (June — ending soon)' : 'OFF'}
                </div>
              </Rule>
              <Rule
                title="Rule 6: Compound Disease Rule"
                on={rules.compoundEnabled}
                onToggle={(v) => set('compoundEnabled', v)}
                desc="Trigger 🔴 Red if TWO diseases rise simultaneously in the same district" />

              <div className="p-4 border border-border rounded-lg bg-epi-bg/30">
                <h3 className="text-[14px] font-bold text-epi-text mb-2">Auto-escalation window</h3>
                <NumberInput
                  label="Hours before an unacknowledged alert escalates"
                  value={rules.autoEscalateHours}
                  onChange={(v) => set('autoEscalateHours', Math.max(1, v))} />

              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                disabled={!dirty}
                onClick={() => actions.updateRules(rules)}
                className="w-full py-3 bg-epi text-white text-[14px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-50 transition-colors shadow-sm">

                {dirty ? 'Save All Rules' : 'All rules saved'}
              </button>
              <button
                onClick={() => actions.resetRules()}
                className="w-full py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">

                Reset to RBC Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </WarningLayout>);

}

function Rule({
  title,
  desc,
  on,
  onToggle,
  children






}: {title: string;desc: string;on: boolean;onToggle: (v: boolean) => void;children?: React.ReactNode;}) {
  return (
    <div className={`p-4 border border-border rounded-lg ${on ? 'bg-epi-bg/30' : 'bg-white opacity-70'}`}>
      <div className="flex justify-between items-start gap-3 mb-2">
        <h3 className="text-[14px] font-bold text-epi-text">{title}</h3>
        <Toggle on={on} onChange={onToggle} label={title} />
      </div>
      <p className="text-[13px] text-epi-muted mb-3">{desc}</p>
      {children}
    </div>);

}

function NumberInput({ label, value, onChange }: {label: string;value: number;onChange: (v: number) => void;}) {
  return (
    <div className="flex items-center justify-end gap-2 text-[12px]">
      <span className="text-epi-muted">{label}:</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-16 p-1 border border-border rounded text-center focus:outline-none focus:border-epi" />

    </div>);

}
