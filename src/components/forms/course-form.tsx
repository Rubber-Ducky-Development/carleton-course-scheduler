'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { SectionType } from '@/lib/types/scheduler';
import { useSchedulerStore } from '@/lib/store/scheduler';

interface CourseFormProps {
    index: number;
}

export function CourseForm({ index }: CourseFormProps) {
    const {
        preferences,
        updateCourseCode,
        updatePreferredInstructor,
        updateSectionTypes,
        removeCourse
    } = useSchedulerStore();

    const course = preferences.courses[index];

    const sectionTypes: SectionType[] = ['Online', 'Hybrid', 'In-Person'];

    const handleSectionTypeChange = (type: SectionType, checked: boolean) => {
        let newTypes = [...course.sectionTypes];

        if (checked) {
            newTypes.push(type);
        } else {
            newTypes = newTypes.filter(t => t !== type);
        }

        updateSectionTypes(index, newTypes);
    };    return (
        <Card 
            onRemove={index > 0 ? () => removeCourse(index) : undefined} 
            className="p-4 hover:bg-purple-50/30 transition-colors course-card h-full"
        >
            <div className="space-y-3">                <Input
                    label={`Course ${index + 1}`}
                    className="label-indigo"
                    placeholder="Enter course code (e.g., COMP1405)"
                    value={course.courseCode}
                    onChange={(e) => updateCourseCode(index, e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 15))}
                    maxLength={15}
                />

                <Input
                    label="Preferred Instructor"
                    placeholder="Enter preferred instructor name"
                    value={course.preferredInstructor}
                    onChange={(e) => updatePreferredInstructor(index, e.target.value)}
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
