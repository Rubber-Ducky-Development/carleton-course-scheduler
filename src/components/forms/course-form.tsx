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
    };

    return (
        <div className="bg-peach-100 border border-peach-300 rounded-xl shadow-md p-6 mb-6">
            <Card onRemove={index > 0 ? () => removeCourse(index) : undefined} className="bg-peach-50 border-peach-300 shadow-sm">
                <div className="space-y-4">
                    <Input
                        label={`Course ${index + 1}`}
                        placeholder="Enter course code (e.g., COMP1405)"
                        value={course.courseCode}
                        onChange={(e) => updateCourseCode(index, e.target.value)}
                    />

                    <Input
                        label="Preferred Instructor"
                        placeholder="Enter preferred instructor name"
                        value={course.preferredInstructor}
                        onChange={(e) => updatePreferredInstructor(index, e.target.value)}
                    />

                    <div className="space-y-2">
                        <p className="text-sm font-medium text-contrast">
                            Section Type Preferences
                        </p>

                        <div className="flex flex-wrap gap-4">
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
        </div>
    );
}
