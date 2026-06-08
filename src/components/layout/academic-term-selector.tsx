'use client';

import { Select } from '@/components/ui/select';
import { AcademicTerm } from '@/lib/types/scheduler';

interface AcademicTermSelectorProps {
  currentTerm: AcademicTerm;
  onTermChange: (term: AcademicTerm) => void;
  className?: string;
}

const termOptions = [
  { value: 'fall-2026', label: 'Fall 2026', season: 'fall' as const, year: 2026 as const },
  { value: 'winter-2027', label: 'Winter 2027', season: 'winter' as const, year: 2027 as const },
];

const levelOptions = [
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate' },
];

export function AcademicTermSelector({ currentTerm, onTermChange, className }: AcademicTermSelectorProps) {
  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          label="Term"
          value={`${currentTerm.season}-${currentTerm.year}`}
          onChange={(event) => {
            const selected = termOptions.find((option) => option.value === event.target.value);
            if (!selected) {
              return;
            }

            onTermChange({
              ...currentTerm,
              season: selected.season,
              year: selected.year,
            });
          }}
          options={termOptions.map((option) => ({ value: option.value, label: option.label }))}
        />
        <Select
          label="Level"
          value={currentTerm.level}
          onChange={(event) => {
            onTermChange({
              ...currentTerm,
              level: event.target.value === 'graduate' ? 'graduate' : 'undergraduate',
            });
          }}
          options={levelOptions}
        />
      </div>
    </div>
  );
}
