import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import SubmitLoader from "@/components/custom/app-components/loaders/submit-loader";
import { LoaderIcon } from "lucide-react";
import CustomInput from "@/components/forms/custom-input";
import { toast } from "sonner"; // Assuming you are using sonner for toast notifications
import { UseGetUserDetails } from "../hooks/query/use-get-user-details-by-id";
import {
  UpdateUserDetailsZodType,
  useUpdateUserDetails,
} from "../hooks/mutation/update-user-details";
import CustomTextarea from "@/components/forms/custom-textarea";
import CustomProfileSelect from "@/components/forms/profile-select";
import { fruitOptions } from "@/constants/data";

const UpdateUserDetailsPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: existingUserDetails } = UseGetUserDetails(); // Fetch existing details

  const {
    UpdateUserDetailsForm: form,
    mutate: updateUserDetails,
    isPending: updatingUserDetails,
  } = useUpdateUserDetails();

  // Set default values when existingUserDetails is available
  useEffect(() => {
    if (existingUserDetails) {
      form.reset({
        userDetailsId: existingUserDetails._id,
        extraUserDetails: existingUserDetails.extraUserDetais,
      });
    }
  }, [existingUserDetails, form]);

  const handleUpdateUserDetails = async (values: UpdateUserDetailsZodType) => {
    setErrorMessage(null);
    setShowSuccess(false);
    if (existingUserDetails?._id) {
      updateUserDetails(
        {
          userDetailsId: existingUserDetails._id,
          extraUserDetails: values.extraUserDetails, // Send only extraUserDetails
        },
        {
          onSuccess: () => {
            toast.success("User details updated successfully!");
            setShowSuccess(true);
          },
          onError: (error) => {
            console.error("Error updating user details:", error);
            setErrorMessage("Failed to update user details. Please try again.");
            toast.error("Failed to update user details.");
          },
          onSettled: () => {
            // Any actions to perform after success or error
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full py-6 flex justify-center sm:py-12">
      <div className="max-w-screen-md w-full space-y-8 px-4 sm:px-8 lg:px-16">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Your Details
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please fill in your details below.
          </p>
        </div>
        <div className="mt-5 bg-white shadow rounded-lg p-6 sm:p-8">
          {/* ... Success and error messages ... */}
          {showSuccess && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">
                {" "}
                Your details have been updated.
              </span>
            </div>
          )}
          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {errorMessage}</span>
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateUserDetails)}
              className="space-y-6"
            >
              <CustomProfileSelect
                control={form.control}
                name="extraUserDetails.customProfilePicture"
                label="Select a Fruit"
                placeholder="Choose a fruit"
                options={fruitOptions}
              />
              <div className="flex flex-row gap-x-2">
                <CustomInput
                  control={form.control}
                  label="First Name"
                  name="extraUserDetails.firstName"
                  disabled={updatingUserDetails}
                  placeholder="Enter your first name"
                />
                <CustomInput
                  control={form.control}
                  label="Last Name"
                  name="extraUserDetails.lastName"
                  disabled={updatingUserDetails}
                  placeholder="Enter your last name"
                />
              </div>

              <div className="flex flex-row gap-x-2">
                <CustomInput
                  control={form.control}
                  label="Additional Email"
                  name="extraUserDetails.addAdditionalEmail"
                  disabled={updatingUserDetails}
                  placeholder="Enter an additional email"
                />
                <CustomInput
                  control={form.control}
                  label="Additional Name"
                  name="extraUserDetails.addAdditionalName"
                  disabled={updatingUserDetails}
                  placeholder="Enter an additional name"
                />
                <CustomInput
                  control={form.control}
                  label="Phone Number"
                  name="extraUserDetails.phoneNumber"
                  disabled={updatingUserDetails}
                  placeholder="Enter your phone number"
                />
              </div>
              <CustomTextarea
                control={form.control}
                label="Address"
                name="extraUserDetails.address"
                disabled={updatingUserDetails}
                placeholder="Enter your address"
              />

              <div>
                <SubmitLoader
                  defaultText="Update Details"
                  loadingIcon={LoaderIcon}
                  loadingState={updatingUserDetails}
                  loadingText="Updating.."
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserDetailsPage;
