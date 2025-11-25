# Thailand Visa Tracker

A comprehensive visa tracking system for short-term travellers visiting Thailand, designed for the LeaveLab tourist section.

## Features

- **Real-time Visa Countdown**: Live tracking of remaining days on your visa
- **Automatic Calculation**: Calculates visa expiry based on visa type and passport country
- **Extension Tracking**: Record and track visa extensions at immigration offices
- **Multiple Visa Types**: Support for visa exemptions, tourist visas, education visas, and more
- **Country-Specific Rules**: Accurate day calculations based on passport country
- **Beautiful UI**: Uses LeaveLab's brand design system with glass effects and dark theme
- **Responsive Design**: Works seamlessly on mobile and desktop devices

## Visa Exemption Rules

### Standard Countries (60 + 30 Days)
Most major countries receive:
- **Initial Stay**: 60 days visa exemption upon entry
- **Extension**: Additional 30 days available at any Thai immigration office
- **Total Maximum**: 90 days

Supported countries include: UK, USA, Australia, Canada, Germany, France, Italy, Spain, Netherlands, Belgium, Switzerland, Austria, Sweden, Norway, Denmark, Finland, Ireland, New Zealand, Singapore, Japan, South Korea.

### Other Countries
- **Initial Stay**: 30 days
- **Extension**: Additional 30 days
- **Total Maximum**: 60 days

## Architecture

### File Structure

```
src/features/visa-tracker/
├── components/
│   ├── VisaTrackerDashboard.tsx    # Main dashboard component
│   ├── VisaStatusCard.tsx          # Visa status display card
│   ├── CreateEntryForm.tsx         # Form to create new entries
│   └── ExtensionCard.tsx           # Extension recording UI
├── hooks/
│   ├── useVisaTracker.ts           # Main data management hook
│   └── useVisaCalculation.ts       # Visa calculation hook
├── lib/
│   └── visa-calculations.ts        # Calculation utilities
├── constants/
│   └── visa-rules.ts               # Visa exemption rules
├── types/
│   └── index.ts                    # TypeScript type definitions
└── index.ts                        # Public API exports

src/app/
├── (dashboard)/visa-tracker/
│   └── page.tsx                    # Visa tracker page route
└── api/v1/visa-tracker/
    ├── route.ts                    # GET, POST endpoints
    └── [id]/route.ts               # PATCH, DELETE endpoints

supabase/migrations/
└── 20251125000000_create_visa_tracker.sql  # Database schema
```

### Database Schema

**Table**: `visa_tracker_entries`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| country | TEXT | Country (default: 'Thailand') |
| visa_type | TEXT | Type of visa |
| passport_country | TEXT | Passport country (for exemptions) |
| entry_date | TIMESTAMPTZ | Date/time of entry |
| exit_date | TIMESTAMPTZ | Date/time of exit (nullable) |
| initial_stay_days | INTEGER | Initial allowed days |
| extension_days | INTEGER | Days added by extension |
| has_extended | BOOLEAN | Whether visa has been extended |
| extension_date | TIMESTAMPTZ | When extension was granted |
| notes | TEXT | User notes |
| created_at | TIMESTAMPTZ | Record creation time |
| updated_at | TIMESTAMPTZ | Last update time |

**Security**: Row Level Security (RLS) policies ensure users can only access their own entries.

## API Endpoints

### GET /api/v1/visa-tracker
Fetch all visa tracker entries for the authenticated user.

**Response**:
```json
{
  "entries": [
    {
      "id": "uuid",
      "userId": "uuid",
      "country": "Thailand",
      "visaType": "visa_exemption",
      "passportCountry": "UK",
      "entryDate": "2025-01-15T10:00:00Z",
      "initialStayDays": 60,
      "extensionDays": 0,
      "hasExtended": false,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### POST /api/v1/visa-tracker
Create a new visa tracker entry.

**Request Body**:
```json
{
  "visaType": "visa_exemption",
  "passportCountry": "UK",
  "entryDate": "2025-01-15T10:00:00Z",
  "notes": "Entered via Bangkok airport"
}
```

### PATCH /api/v1/visa-tracker/[id]
Update an existing visa entry (record extension or exit).

**Request Body**:
```json
{
  "extensionDate": "2025-03-10T14:00:00Z"
}
```

### DELETE /api/v1/visa-tracker/[id]
Delete a visa entry.

## Usage

### Basic Integration

```tsx
import { VisaTrackerDashboard } from '@/features/visa-tracker';

export default function VisaPage() {
  return <VisaTrackerDashboard />;
}
```

### Using Hooks

```tsx
import { useVisaTracker, useVisaCalculation } from '@/features/visa-tracker';

function MyComponent() {
  const { currentEntry, createEntry, recordExtension } = useVisaTracker();
  const calculation = useVisaCalculation(currentEntry);

  if (!calculation) return null;

  return (
    <div>
      <h2>Days Remaining: {calculation.daysRemaining}</h2>
      <p>Expires: {calculation.finalExpiryDate.toLocaleDateString()}</p>
    </div>
  );
}
```

### Calculation Utilities

```tsx
import {
  calculateVisaStatus,
  getInitialStayDays,
  formatDate
} from '@/features/visa-tracker';

// Calculate visa status
const calculation = calculateVisaStatus(entry, new Date());

// Get initial stay days for a passport
const days = getInitialStayDays('visa_exemption', 'UK'); // Returns 60

// Format date in British format
const formatted = formatDate(new Date()); // Returns "25/11/2025"
```

## Design System

This feature uses LeaveLab's global design system:

- **Colours**: Brand red (#EF4444), dark theme, accent colours
- **Effects**: Glass morphism, 3D card transforms, glow animations
- **Typography**: Font scale from globals.css
- **Components**: Shadcn UI components with custom styling

### Key Classes Used

- `.glass-red` - Red-tinted glass effect
- `.card-3d` - 3D transform on hover
- `.animate-pulse-scale` - Pulsing scale animation
- `text-brand-red` - Brand red colour
- `bg-brand-dark-900` - Dark background

## Future Enhancements

- [ ] Automatic entry detection via geolocation
- [ ] Push notifications for expiry warnings
- [ ] Integration with flight booking APIs
- [ ] Multi-country visa tracking
- [ ] Historical trip analytics
- [ ] PDF export of visa history
- [ ] Integration with calendar apps

## Development

### Running Migrations

```bash
# Apply the visa tracker migration
supabase db push

# Or if using Supabase CLI
supabase migration up
```

### Testing

```bash
# Run type checks
npm run type-check

# Run tests
npm test

# Run in development
npm run dev
```

### Environment Variables

No additional environment variables required. Uses existing Supabase configuration.

## Contributing

When contributing to this feature:

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Adhere to the global design system
4. Write tests for new functionality
5. Update this documentation

## Licence

Part of the LeaveLab platform. See main repository licence.

## Support

For issues or questions:
- Create an issue in the LeaveLab repository
- Contact the development team
- Check the constitution.md for design guidelines

---

**Version**: 1.0.0
**Last Updated**: 25 November 2025
**Maintainer**: LeaveLab Development Team
