import UserDetailsPage from "./user-details-page";
import UpdateUserDetailsPage from "./update-user-details-page";
import { UseGetUserDetails } from "../hooks/query/use-get-user-details-by-id";

const UserProfilePage = () => {
  const { data } = UseGetUserDetails();
  if (data?._id) {
    return <UpdateUserDetailsPage />;
  }
  return (
    <div>
      <UserDetailsPage />
    </div>
  );
};

export default UserProfilePage;
