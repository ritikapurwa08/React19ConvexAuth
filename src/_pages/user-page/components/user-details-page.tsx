import React, { useState } from "react";
import {
  createUserDetailsZodType,
  useCreateUserDetails,
} from "../hooks/mutation/use-create-user-details";
import { Form } from "@/components/ui/form";
import SubmitLoader from "@/components/custom/app-components/loaders/submit-loader";
import { LoaderIcon } from "lucide-react";
import CustomInput from "@/components/forms/custom-input";
import { UseGetCurrentUser } from "../api/use-current-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // Assuming you are using sonner for toast notifications
import { UseGetUserDetails } from "../hooks/query/use-get-user-details-by-id";

const UserDetailsPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = UseGetCurrentUser();

  const {
    UserDetailsForm: form,
    mutate: createUserDetails,
    isPending: creatingUserDetails,
  } = useCreateUserDetails();
  // Optional: Set default values if needed
  // Apply zod schema for validation

  const handleCreateUserDetails = async (values: createUserDetailsZodType) => {
    if (user?._id) {
      setErrorMessage(null); // Clear previous errors
      setShowSuccess(false); // Hide success message
      createUserDetails(
        {
          existingUserId: user._id,
          ...values,
        },
        {
          onSuccess: () => {
            toast.success("User details saved successfully!");
            setShowSuccess(true);
            // Optionally reset the form after successful submission
            // form.reset();
          },
          onError: (error) => {
            console.error("Error creating user details:", error);
            setErrorMessage("Failed to save user details. Please try again.");
            toast.error("Failed to save user details.");
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
          {showSuccess && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">
                {" "}
                Your details have been saved.
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
              onSubmit={form.handleSubmit(handleCreateUserDetails)}
              className="space-y-6"
            >
              <div className="flex flex-row gap-x-2">
                <CustomInput
                  control={form.control}
                  label="First Name"
                  name="extraUserDetais.firstName"
                  disabled={creatingUserDetails}
                  placeholder="Enter your first name"
                />
                <CustomInput
                  control={form.control}
                  label="Last Name"
                  name="extraUserDetais.lastName"
                  disabled={creatingUserDetails}
                  placeholder="Enter your last name"
                />
              </div>
              <CustomInput
                control={form.control}
                label="Phone Number"
                name="extraUserDetais.phoneNumber"
                disabled={creatingUserDetails}
                placeholder="Enter your phone number"
              />
              <CustomInput
                control={form.control}
                label="Address"
                name="extraUserDetais.address"
                disabled={creatingUserDetails}
                placeholder="Enter your address"
              />
              <div className="flex flex-row gap-x-2">
                <CustomInput
                  control={form.control}
                  label="Additional Email"
                  name="extraUserDetais.addAdditionalEmail"
                  disabled={creatingUserDetails}
                  placeholder="Enter an additional email"
                />
                <CustomInput
                  control={form.control}
                  label="Additional Name"
                  name="extraUserDetais.addAdditionalName"
                  disabled={creatingUserDetails}
                  placeholder="Enter an additional name"
                />
              </div>
              <CustomInput
                control={form.control}
                label="Profile Picture URL"
                name="extraUserDetais.customProfilePicture"
                disabled={creatingUserDetails}
                placeholder="Enter a URL for your profile picture"
              />
              <div>
                <SubmitLoader
                  defaultText="Save Details"
                  loadingIcon={LoaderIcon}
                  loadingState={creatingUserDetails}
                  loadingText="Saving.."
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

export default UserDetailsPage;
