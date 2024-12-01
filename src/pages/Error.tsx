import { useNavigate } from "react-router";

export default function Error() {
  const navigate = useNavigate();

  const handleGoBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <img
            src="/src/assets/404.png"
            alt="hashtag-character-404"
            className="sm:w-1/3 md:w-3/4 mx-auto"
          />
          <h1 className="text-5xl font-bold">Page Not Found</h1>
          <p className="py-6">
            Oops! The page you’re looking for doesn’t exist. It might have been
            moved, deleted, or perhaps the URL is incorrect
          </p>
          <button className="btn btn-primary" onClick={handleGoBackToHome}>
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
