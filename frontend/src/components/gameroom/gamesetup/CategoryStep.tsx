import React from 'react';
import { Form, Button } from 'react-bootstrap';

interface CategoryStepProps {
    categories: string[];
    onCategoryChange: (index: number, value: string) => void;
    onSubmit: () => void;
}

const CategoryStep: React.FC<CategoryStepProps> = ({ categories, onCategoryChange, onSubmit }) => {
    return (
        <div className="fade show">
            <h3 className="mb-4">Select your 3 categories </h3>
            <h6 className="mb-3">(max 25 characters per input)</h6>
            {categories.map((category, index) => (
                <Form.Group className="mb-3" key={index}>
                    <Form.Label>Category {index + 1}</Form.Label>
                    <Form.Control
                        type="text"
                        value={category}
                        maxLength={25}
                        onChange={(e) => onCategoryChange(index, e.target.value)}
                        style={{ backgroundColor: '#2f2f2f', color: '#f9f9f9'}}
                    />
                </Form.Group>
            ))}
            <Button variant="primary" onClick={onSubmit}>Submit</Button>
        </div>
    );
};

export default CategoryStep;
