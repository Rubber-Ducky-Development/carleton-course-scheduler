'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { SectionType } from '@/lib/types/scheduler';
import { useSchedulerStore } from '@/lib/store/scheduler';
import { useState, useRef } from 'react';

interface CourseFormProps {
    index: number;
}

export function CourseForm({ index }: CourseFormProps) {
    const {
        getCurrentPreferences,
        updateCourseCode,
        updatePreferredInstructor,
        updateSectionTypes,
        removeCourse
    } = useSchedulerStore();

    const preferences = getCurrentPreferences();
    const course = preferences.courses[index];

    const sectionTypes: SectionType[] = ['Online', 'Hybrid', 'In-Person'];

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const fetchSuggestions = async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }
        const res = await fetch(`/api/course-codes?q=${encodeURIComponent(query)}`);
        if (res.ok) {
            setSuggestions(await res.json());
        }
    };

    const handleCourseCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 15);
        updateCourseCode(index, value);
        fetchSuggestions(value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (code: string) => {
        updateCourseCode(index, code);
        setShowSuggestions(false);
        setSuggestions([]);
        inputRef.current?.blur();
    };

    const handleSectionTypeChange = (type: SectionType, checked: boolean) => {
        let newTypes = [...course.sectionTypes];

        if (checked) {
            newTypes.push(type);
        } else {
            newTypes = newTypes.filter(t => t !== type);
        }

        updateSectionTypes(index, newTypes);
    };

    return (
        <Card 
            onRemove={index > 0 ? () => removeCourse(index) : undefined} 
            className="p-4 hover:bg-purple-50/30 transition-colors course-card h-full relative"
        >
            <div className="space-y-3">
                <div className="relative">
                    <Input
                        ref={inputRef}
                        label={`Course ${index + 1}`}
                        className="label-indigo"
                        placeholder="Enter course code (e.g., COMP1405)"
                        value={course.courseCode}
                        onChange={handleCourseCodeChange}
                        maxLength={15}
                        onFocus={() => course.courseCode.length >= 2 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-48 overflow-auto">
                            {suggestions.map(code => (
                                <li
                                    key={code}
                                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                                    onMouseDown={() => handleSuggestionClick(code)}
                                >
                                    {code}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <Input
                    label="Preferred Instructor"
                    placeholder="Enter preferred instructor name"
                    value={course.preferredInstructor}
                    onChange={(e) => updatePreferredInstructor(index, e.target.value.replace(/[^a-zA-Z\s\-'.]/g, '').substring(0, 35))}
                    maxLength={35}
                />
                <div>
                    <p className="text-sm text-indigo-600 font-medium mb-2">
                        Section Types
                    </p>

                    <div className="flex flex-wrap gap-3 bg-purple-50/70 p-3 rounded-lg border border-purple-100/60">
                        {sectionTypes.map((type) => (
                            <Checkbox
                                key={type}
                                id={`course-${index}-${type}`}
                                label={type}
                                checked={course.sectionTypes.includes(type)}
                                onChange={(e) => handleSectionTypeChange(type, e.target.checked)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
