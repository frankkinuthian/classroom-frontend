# classroom-frontend

<div align="center" style="margin: 30px;">
    <a href="https://refine.dev">
    <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
    </a>
</div>
<br/>

This [Refine](https://github.com/refinedev/refine) project was generated with [create refine-app](https://github.com/refinedev/refine/tree/master/packages/create-refine-app).

## Getting Started

A React Framework for building internal tools, admin panels, dashboards & B2B apps with unmatched flexibility ✨

Refine's hooks and components simplifies the development process and eliminates the repetitive tasks by providing industry-standard solutions for crucial aspects of a project, including authentication, access control, routing, networking, state management, and i18n.

## Environment Setup

1. Create your local env file:

```bash
cp .env.example .env
```

2. Update `.env` values for your environment.

Required variables:

- `VITE_BACKEND_BASE_URL`: Backend API base URL (example: `http://localhost:8000/api`)
- `VITE_API_URL`: Base URL used for auth token refresh URL construction
- `VITE_ACCESS_TOKEN_KEY`: Local storage key for the access token
- `VITE_REFRESH_TOKEN_KEY`: Local storage key for the refresh token
- `VITE_CLOUDINARY_UPLOAD_URL`: Cloudinary upload endpoint
- `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Cloudinary unsigned upload preset

## Available Scripts

### Running the development server.

```bash
    pnpm dev
```

### Building for production.

```bash
    pnpm build
```

### Running the production server.

```bash
    pnpm start
```

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **REST Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **shadcn/ui** [Docs](https://refine.dev/docs/guides-concepts/general-concepts/#headless-concept)
- **React Router** [Docs](https://refine.dev/docs/core/providers/router-provider/)

## License

MIT
