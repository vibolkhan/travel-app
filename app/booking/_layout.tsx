import { Redirect, Stack } from "expo-router";

import { useAuth } from "../../context/AuthContext";

export default function BookingLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect href="/auth/login" />;
  return <Stack />;
}
