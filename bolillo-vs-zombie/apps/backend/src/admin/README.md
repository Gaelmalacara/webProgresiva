# Admin Customizations

You can extend the Medusa Admin to add widgets and new pages. Your customizations interact with API routes to provide merchants with custom functionalities.

> Learn more about Admin Extensions in [this documentation](https://docs.medusajs.com/learn/fundamentals/admin).

## Example: Create a Widget

A widget is a React component that can be injected into an existing page in the admin dashboard.

For example, create the file `src/admin/widgets/product-widget.tsx` with the following content:

```tsx title="src/admin/widgets/product-widget.tsx"
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// The widget
const ProductWidget = () => {
  return (
    <div>
      <h2>Product Widget</h2>
    </div>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductWidget;
```

This inserts a widget with the text “Product Widget” at the end of a product’s details page.

## Project Admin pages

The custom `analytics` route adds a **Statistics / Estadísticas** page to the
sidebar. It reads the authenticated `GET /admin/analytics` endpoint and shows
the totals already recorded by the storefront analytics module; it does not
change that module or its database schema.

Medusa's dashboard includes Spanish translations. `medusa-config.ts` sets the
Admin language to Spanish on every page load, including the built-in dashboard
and project-specific labels in `src/admin/i18n`.

The Admin shell keeps **Usuarios** and **Estadísticas** visible in the sidebar
and hides the other top-level entries and the Settings shortcut. This is a
navigation-only change: Medusa's built-in commerce routes and permissions are
preserved and can still be reached directly by authorized administrators.
