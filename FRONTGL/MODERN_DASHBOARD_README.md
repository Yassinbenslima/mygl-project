# Modern Dashboard - Spring Boot API Integration

## Overview

This is a completely redesigned, modern dashboard for managing enseignants (teachers) and séances (sessions) with beautiful, innovative UI design. The dashboard connects to Spring Boot APIs and provides an intuitive interface for assigning séances to enseignants.

## Features

### 🎨 Modern Design
- **Beautiful gradient headers** with animated backgrounds
- **Card-based layout** instead of traditional tables
- **Smooth animations** and hover effects
- **Responsive design** for all screen sizes
- **Modern color scheme** with professional styling

### 🔍 Interactive Features
- **Real-time search** across enseignants and séances
- **Department filtering** to narrow down results
- **Status filtering** (Available, Assigned, Busy)
- **Visual status indicators** with color-coded chips
- **Progress bars** showing enseignant utilization

### 📊 Data Management
- **Spring Boot API integration**:
  - `/enseignant/all` - Display all enseignants
  - `/enseignant/add-sceances` - Assign séances to enseignants
  - `/get/Allseances` - Display all séances
- **Fallback to test data** when API is unavailable
- **Real-time data updates** after assignments

### 🎯 User Experience
- **Intuitive séance assignment** with checkbox selection
- **Visual feedback** for all actions
- **Smooth transitions** between states
- **Mobile-friendly** responsive design
- **Accessibility** considerations

## Components Structure

```
src/app/components/
├── admin-dashboard/           # Main admin dashboard wrapper
│   ├── admin-dashboard.ts
│   ├── admin-dashboard.html
│   └── admin-dashboard.scss
└── modern-dashboard/          # Modern dashboard implementation
    ├── modern-dashboard.ts
    ├── modern-dashboard.html
    └── modern-dashboard.scss
```

## Services

```
src/app/services/
├── api.service.ts            # Spring Boot API integration
├── test-data.service.ts      # Test data for demonstration
└── auth.service.ts           # Authentication service
```

## Interfaces

```
src/app/interfaces/
├── spring-boot-api.interface.ts  # Data structures for Spring Boot APIs
└── api-response.interface.ts      # Generic API response interface
```

## API Endpoints

The dashboard connects to these Spring Boot endpoints:

1. **GET `/enseignant/all`**
   - Returns all enseignants
   - Used to populate the enseignants grid

2. **GET `/get/Allseances`**
   - Returns all séances
   - Used to display available séances for assignment

3. **POST `/enseignant/add-sceances`**
   - Assigns séances to an enseignant
   - Body: `{ enseignantId: number, seanceIds: number[] }`

## Usage

### Basic Usage
```typescript
// The dashboard automatically loads data on initialization
// It will try Spring Boot API first, then fallback to test data
```

### Customization
```scss
// Modify colors in modern-dashboard.scss
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$card-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
```

## Testing

The dashboard includes test data for demonstration purposes. When the Spring Boot API is not available, it automatically falls back to test data with:

- 6 sample enseignants from different departments
- 6 sample séances with various statuses
- Realistic data for testing all features

## Responsive Design

The dashboard is fully responsive with breakpoints:
- **Desktop**: Full grid layout with all features
- **Tablet**: Adjusted grid columns and spacing
- **Mobile**: Single column layout with optimized touch targets

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced filtering options
- [ ] Export functionality
- [ ] Calendar integration
- [ ] Analytics dashboard
- [ ] Bulk operations

## Development

To run the dashboard:

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build --prod
```

## API Configuration

Update the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // Your Spring Boot API URL
};
```

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Include responsive design considerations
4. Test on multiple screen sizes
5. Update documentation for new features
