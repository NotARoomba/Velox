import {
  View,
  Text,
  Alert,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  TextInput,
  Image,
  Platform,
} from "react-native";
import Letters from "../components/Letters";
import { useSession } from "../hooks/useSession";
import React, { useEffect, useState } from "react";
import Reanimated, { FadeIn, FadeOut } from "react-native-reanimated";
import Icons from "@expo/vector-icons/Octicons";
import useCamera from "../hooks/useCamera";
import useGallery from "../hooks/useGallery";
import { supabase } from "../utils/supabase";
import Skeleton from "react-native-reanimated-skeleton";
import { useTranslation } from "react-i18next";
import { ImagePickerAsset } from "expo-image-picker";
import { User } from "../utils/types";
import Animated from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useLoading } from "../hooks/useLoading";
import { useSettings } from "../hooks/useSettings";

export default function Profile() {
  const { theme } = useSettings();
  const { session } = useSession();
  const camera = useCamera();
  const gallery = useGallery();
  const [pictureLoading, setPictureLoading] = useState(true);
  const [pictureLoaded, setPictureLoaded] = useState(false);
  const [activeChange, setActiveChange] = useState(false);
  const { loading, setLoading } = useLoading();
  const [user, setUser] = useState<null | User>(null);
  const [userEdit, setUserEdit] = useState<null | User>(null);
  const { t } = useTranslation();
  const downloadImage = async (path: string | null) => {
    try {
      if (!path)
        return setUserEdit((prev) => ({ ...(prev as User), avatar_url: null }));
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setUserEdit((prev) => ({
        ...(prev as User),
        avatar_url: data.publicUrl as string,
      }));
      setUser((prev) => ({
        ...(prev as User),
        avatar_url: data.publicUrl as string,
      }));
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");
      if (userEdit?.avatar_url && typeof userEdit?.avatar_url == "object") {
        const arraybuffer = await fetch(userEdit?.avatar_url.uri).then((res) =>
          res.arrayBuffer()
        );

        const fileExt =
          userEdit?.avatar_url.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
        const path = `${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, arraybuffer, {
            contentType: userEdit?.avatar_url.mimeType ?? "image/jpeg",
          });

        if (uploadError) {
          throw uploadError;
        }
        const updates = {
          id: session?.user.id,
          username: userEdit.username,
          avatar_url: data.path,
        };
        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", session?.user.id);

        if (error) {
          throw error;
        }
        setUser(userEdit);
        downloadImage(data.path);
        Alert.alert(t("success"), t("profile.updateSuccess"));
      } else {
        const updates = {
          id: session?.user.id,
          username: userEdit?.username,
        };
        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", session?.user.id);

        if (error) {
          throw error;
        }
        setUser(userEdit);
        Alert.alert(t("success"), t("profile.updateSuccess"));
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectImage = async (pickerType: "camera" | "gallery") => {
    try {
      let result;
      if (pickerType === "camera") {
        if (!(await camera.requestPermission())) return;
        result = await camera.takePhoto({
          allowsEditing: true,
          quality: 1,
        });
      } else {
        if (!(await gallery.requestPermission())) return;
        result = await gallery.selectImage({
          quality: 1,
          allowsEditing: true,
        });
      }
      setActiveChange(false);

      return result.assets ? result.assets[0] : null;
    } catch (error) {
      Alert.alert(t("images.readingTitle"), t("images.readingDescription"));
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        // console.log(typeof data.avatar_url, typeof null);
        const userData = {
          id: session?.user.id,
          email: session.user.email as string,
          username: data.username,
          avatar_url: data.avatar_url,
        };
        setUser(userData);
        setUserEdit(userData);
        downloadImage(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (session) getProfile();
  }, [session]);
  return (
    userEdit != null && (
      <Animated.View
        entering={FadeIn.duration(300)}
        className="h-full bg-transparent flex z-0"
      >
        <View className="mx-auto bg-transparent w-48 h-48 rounded-full mt-12">
          <View className=" m-auto">
            <TouchableOpacity className=" w-48 h-48  aspect-square flex  rounded-xl mt-4">
              <Image
                // onLoadStart={() => setPictureLoading(true)}
                onLoad={() => {
                  setPictureLoading(false);
                  setPictureLoaded(true);
                }}
                onLoadEnd={() => setPictureLoading(false)}
                className={
                  "rounded-xl border-dashed border dark:border-platinum/80  h-full aspect-square"
                }
                source={
                  typeof userEdit?.avatar_url == "string"
                    ? userEdit.avatar_url.includes("http")
                      ? { uri: userEdit?.avatar_url }
                      : undefined
                    : userEdit?.avatar_url?.uri
                    ? { uri: userEdit?.avatar_url.uri }
                    : undefined
                }
              />

              {pictureLoading && (
                <Animated.View
                  exiting={FadeOut.duration(300)}
                  className=" rounded-xl w-48 h-48  z-50 absolute  flex"
                >
                  <Skeleton
                    animationType="shiver"
                    boneColor={"#151515"}
                    highlightColor="#e8e8e8"
                    layout={[
                      {
                        borderRadius: 12,
                        width: 192,
                        height: 192,
                      },
                    ]}
                    isLoading={pictureLoading}
                  >
                    <View className="m-auto w-48 h-48">
                      <Icons
                        name="person"
                        size={150}
                        color={theme === "dark" ? "#e8e8e8" : "#151515"}
                      />
                    </View>
                  </Skeleton>
                </Animated.View>
              )}
              {((!pictureLoaded && !pictureLoading) ||
                !userEdit?.avatar_url) && (
                <View className="absolute rounded-xl w-48 h-48  z-50  flex">
                  <View className="m-auto ">
                    <Icons name="person" size={150} color={"#fbfff1"} />
                  </View>
                </View>
              )}
              <Pressable
                disabled={pictureLoading}
                onPress={() => setActiveChange(!activeChange)}
                className="absolute rounded-xl w-48 h-48  z-50  flex"
              >
                {activeChange && (
                  <Reanimated.View
                    entering={FadeIn.duration(250)}
                    exiting={FadeOut.duration(250)}
                    className="h-full rounded-xl w-full bg-platinum/50"
                  >
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(t("images.choose"), undefined, [
                          {
                            text: t("images.gallery"),
                            onPress: async () => {
                              const result = (await selectImage(
                                "gallery"
                              )) as ImagePickerAsset | null;
                              setUserEdit((prev) => ({
                                ...(prev as User),
                                avatar_url:
                                  result ??
                                  (userEdit?.avatar_url as string | null),
                              }));
                            },
                          },
                          {
                            text: t("images.camera"),
                            onPress: async () => {
                              const result = (await selectImage(
                                "camera"
                              )) as ImagePickerAsset | null;
                              setUserEdit((prev) => ({
                                ...(prev as User),
                                avatar_url:
                                  result ??
                                  (userEdit?.avatar_url as string | null),
                              }));
                            },
                          },
                          {
                            text: t("buttons.cancel"),
                            style: "cancel",
                          },
                        ])
                      }
                      className="m-auto p-2"
                    >
                      <Icons name="pencil" size={60} color={"#08254099"} />
                    </TouchableOpacity>
                  </Reanimated.View>
                )}
              </Pressable>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-col gap-y-4 mt-8">
          <KeyboardAvoidingView
            className="h-fit"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Text className="text-2xl dark:text-platinum text-night font-bold text-center">
              {t("inputs.username")}
            </Text>
            <TextInput
              className="h-12 w-1/2 dark:bg-platinum/10 bg-night/10 rounded-2xl mx-auto mt-1 text-center dark:text-platinum text-night text-nowrap"
              placeholder={userEdit?.username}
              placeholderTextColor={"#f8f8f8"}
              maxLength={12}
              value={userEdit?.username}
              onChangeText={(text) =>
                setUserEdit((prev) => ({ ...(prev as User), username: text }))
              }
              enterKeyHint="done"
            />
          </KeyboardAvoidingView>
        </View>
        {!loading && JSON.stringify(userEdit) != JSON.stringify(user) && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity
              disabled={loading}
              onPress={updateProfile}
              className="h-12 w-1/2 bg-celtic_blue rounded-2xl mx-auto mt-6 flex items-center justify-center"
            >
              <Text className="dark:text-platinum text-night text-center font-bold">
                {t("buttons.update")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className={
            "absolute  left-4 " +
            (Platform.OS === "android" ? " top-4" : "top-16")
          }
        >
          <TouchableOpacity onPress={router.back}>
            <Ionicons
              color={theme === "dark" ? "#e8e8e8" : "#151515"}
              size={40}
              name="arrow-back"
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className={
            "absolute  left-4 " +
            (Platform.OS === "android" ? " top-4" : "top-16")
          }
        >
          <TouchableOpacity onPress={router.back}>
            <Ionicons
              color={theme === "dark" ? "#e8e8e8" : "#151515"}
              size={40}
              name="arrow-back"
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className={
            "absolute  right-4 " +
            (Platform.OS === "android" ? " top-4" : "top-16")
          }
        >
          <TouchableOpacity
            className="z-50 p-1"
            onPress={() =>
              Alert.alert(
                t("profile.logoutTitle"),
                t("profile.logoutDescription"),
                [
                  { text: t("buttons.cancel"), style: "cancel" },
                  {
                    text: t("profile.logoutTitle"),
                    style: "destructive",
                    onPress: () => {
                      supabase.auth.signOut();
                      router.replace({ pathname: "/" });
                    },
                  },
                ]
              )
            }
          >
            <Icons
              name="sign-out"
              size={38}
              color={theme == "light" ? "#151515" : "#e8e8e8"}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    )
  );
}
