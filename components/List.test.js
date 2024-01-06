import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import List from './List';

describe('List Component', () => {
    it('renders List component with initial data', () => {
        const mockData = {
            repository: {
                issues: {
                    edges: [
                        { node: { number: 1, title: 'Issue 1' } },
                        { node: { number: 2, title: 'Issue 2' } },
                        // ... more mock issues ...
                    ],
                    pageInfo: {
                        endCursor: 'someCursorValue',
                        hasNextPage: true,
                    },
                },
            },
        };
        render(<List data={mockData} />);
    });
});
