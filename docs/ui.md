# UI Coding Standards

This document outlines the strict UI coding standards for the lifting diary course project. These standards must be adhered to throughout the entire application development process.

## Component Standards

### shadcn/ui Components Only

**CRITICAL RULE: Only shadcn/ui components are permitted for UI development in this project.**

- **NO custom components** should be created under any circumstances
- **ALL UI elements** must use shadcn/ui components exclusively
- If a required UI pattern is not available in shadcn/ui, consult with the team lead before proceeding

### Component Usage Guidelines

1. **Installation**: Use `npx shadcn@latest add <component-name>` to add new components
2. **Imports**: Always import components from the local shadcn/ui components directory: `@/components/ui/*`
3. **Customization**: Only modify shadcn/ui components through:
   - Tailwind CSS classes
   - CSS custom properties defined in `globals.css`
   - Component variants and props provided by shadcn/ui

### Prohibited Practices

- ❌ Creating custom React components for UI elements
- ❌ Writing raw HTML elements when shadcn/ui alternatives exist
- ❌ Building custom form controls, buttons, or interactive elements
- ❌ Implementing custom styling patterns outside of Tailwind CSS

## Date Formatting Standards

### Library Requirement

**MANDATORY: All date formatting must use the `date-fns` library.**

### Date Format Specification

Dates throughout the application must follow this exact format pattern:

```
1st Sep 2025
2nd Jul 2024
3rd Aug 2026
4th Jan 2025
```

### Format Requirements

- **Day**: Include ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
- **Month**: Use 3-letter abbreviation (Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec)
- **Year**: Full 4-digit year
- **Spacing**: Single space between day and month, single space between month and year

### Implementation Example

```typescript
import { format } from 'date-fns';

// Correct date formatting
const formatDate = (date: Date): string => {
  const day = format(date, 'do'); // 1st, 2nd, 3rd, etc.
  const month = format(date, 'MMM'); // Jan, Feb, Mar, etc.
  const year = format(date, 'yyyy'); // 2024, 2025, etc.

  return `${day} ${month} ${year}`;
};

// Usage
const formattedDate = formatDate(new Date()); // "1st Sep 2025"
```

### Date Formatting Rules

1. **Consistency**: All dates across the application must use this exact format
2. **No Exceptions**: This format applies to all date displays (tables, cards, forms, etc.)
3. **User Input**: Date inputs may use different formats but must display in the standard format
4. **Internationalization**: This format is the project standard regardless of locale

## Component Integration Guidelines

### Form Components

- Use shadcn/ui form components (`Form`, `FormControl`, `FormField`, etc.)
- Date inputs should use shadcn/ui `Calendar` and `Popover` components
- All form validation should integrate with shadcn/ui form patterns

### Layout Components

- Use shadcn/ui layout components where available
- Utilize shadcn/ui `Card`, `Sheet`, `Dialog` components for content organization
- Navigation should use shadcn/ui navigation components

### Data Display

- Tables must use shadcn/ui `Table` components
- Lists should use appropriate shadcn/ui components
- All data displays must incorporate the standardized date formatting

## Styling Standards

### Tailwind CSS Integration

- Use Tailwind CSS classes for all styling
- Follow the existing theme configuration in `globals.css`
- Maintain consistency with the project's dark mode implementation

### Color and Theme

- Use CSS custom properties defined in `globals.css`
- Follow the existing color scheme and design tokens
- Ensure dark mode compatibility for all UI elements

## Quality Assurance

### Code Review Checklist

Before submitting any UI-related code, verify:

- [ ] Only shadcn/ui components are used
- [ ] No custom components have been created
- [ ] All dates use the specified format with date-fns
- [ ] Tailwind CSS classes are used appropriately
- [ ] Components integrate properly with the existing theme

### Enforcement

Non-compliance with these standards will result in:
- Immediate code review rejection
- Required refactoring before merge approval
- Potential rework of affected features

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [date-fns Documentation](https://date-fns.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**Remember: These standards are non-negotiable. Consistency in UI implementation is critical for maintainability and user experience.**