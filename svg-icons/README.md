# SVG Icons Collection

This directory contains individual SVG files for various home service categories. Each icon is designed with a consistent 115x115 viewBox and uses a cohesive color palette.

## Available Icons

- **bathroom.svg** - Bathroom renovation and services
- **cabinets.svg** - Cabinet installation and renovation
- **deck.svg** - Deck construction and maintenance
- **doors.svg** - Door installation and replacement
- **fencing.svg** - Fence installation and repair
- **flooring.svg** - Flooring installation and refinishing
- **foundations.svg** - Foundation repair and construction
- **garage-doors.svg** - Garage door installation and repair
- **home-security.svg** - Home security systems
- **home-warranty.svg** - Home warranty services
- **hot-tubs.svg** - Hot tub installation and maintenance
- **hvac.svg** - HVAC systems and maintenance
- **insulation.svg** - Insulation installation
- **kitchen.svg** - Kitchen renovation and remodeling
- **medical-alerts.svg** - Medical alert systems
- **plumbing.svg** - Plumbing services and repair
- **restoration.svg** - Home restoration services
- **roofing.svg** - Roofing installation and repair
- **siding.svg** - Siding installation and replacement
- **solar.svg** - Solar panel installation
- **stair-lifts.svg** - Stair lift installation
- **tree-services.svg** - Tree removal and landscaping
- **walk-in-tubs.svg** - Walk-in tub installation
- **water-damage.svg** - Water damage restoration
- **water-treatment.svg** - Water treatment systems
- **windows.svg** - Window installation and replacement

## Color Palette

The icons use a consistent color scheme:
- **Primary Purple**: `#9315F6`
- **Light Purple**: `#B9B1E7`
- **Lightest Purple**: `#DFDBF7`
- **Very Light Purple**: `#EFECFF`
- **White**: `#fff`
- **Dark**: `#352157`

## Usage

### HTML
```html
<img src="svg-icons/bathroom.svg" alt="Bathroom services" width="24" height="24" />
```

### CSS Background
```css
.icon-bathroom {
    background-image: url('svg-icons/bathroom.svg');
    background-size: contain;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
}
```

### Inline SVG
Copy the SVG content directly into your HTML for maximum flexibility and styling control.

## File Structure

Each SVG file:
- Uses `xmlns="http://www.w3.org/2000/svg"`
- Has `viewBox="0 0 115 115"`
- Contains `fill="none"` on the root element
- Groups content with `<g id="service-name">`
- Uses consistent stroke widths (typically 1.5px)

## Customization

These SVG files can be easily customized by:
- Changing fill colors
- Adjusting stroke widths
- Modifying viewBox for different aspect ratios
- Adding CSS classes for styling

## License

These icons are created for the modal calculator project and can be used according to your project's license terms.
