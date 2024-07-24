// pages/404.js
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="container mt-4 text-center">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/" passHref legacyBehavior>
        <a>Go back to the homepage</a>
      </Link>
    </div>
  );
};

export default NotFoundPage;
