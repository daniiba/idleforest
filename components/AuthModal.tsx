import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "~@/components/ui/alert";
import { supabase } from "~core/supabase";
import { useAuth } from "~context/AuthProvider";
import { Input } from '~@/components/ui/input';
import type { AuthModalProps } from "~api/types";
import { useQueryClient } from "@tanstack/react-query";
import { Storage } from "@plasmohq/storage";
import browser from "webextension-polyfill";

const getRedirectUrl = () => {
	const extensionId = process.env.NODE_ENV === 'development' 
    ? 'mhbegikigmopbapdpdpiclehfpbncpoc'  // Dev ID
    : 'ofdclafhpmccdddnmfalihgkahgiomjk';  // Prod ID
	return `chrome-extension://${extensionId}/options.html`;
};


export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
	const { mellowtel } = useAuth(); // Get mellowtel from auth context
   
	const queryClient = useQueryClient();
	const storage = new Storage({ area: "local" });
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");


	const handleAuth = async (type: "signup" | "login") => {
		try {
			setLoading(true);
			setError("");
			setSuccess("");
	
			if (type === "signup") {
				// Get stored referral code if any
				const referralCode = await storage.get('referralCode');
				
				const { error, data } = await supabase.auth.signUp({ 
					email, 
					password,
					options: {
						data: {
							display_name: displayName,
							referral_code: referralCode || null
						},
					}
				});
	
				if (error) {
					setError(error.message);
					return;
				}

				// Clear the pending referral code after successful signup
				if (referralCode) {
					await storage.remove('referralCode');
				}

				// After successful signup, connect node if it exists
				const nodeId = await mellowtel.getNodeId();
				if (nodeId && data?.user?.id) {
					await supabase
						.from('nodes')
						.update({ user_id: data.user.id })
						.eq('node_identifier', nodeId);
				}

				queryClient.invalidateQueries({ queryKey: ['session'] });
				onOpenChange(false);
	
			} else {
				const { error } = await supabase.auth.signInWithPassword({ 
					email, 
					password 
				});
	
				if (error) {
					setError(error.message);
				} else {
					// After successful login, connect node if it exists
					const nodeId = await mellowtel.getNodeId();
					const { data: existingNode } = await supabase
						.from('nodes')
						.select('node_identifier, user_id')
						.eq('node_identifier', nodeId)
						.single();
	
					if (existingNode && !existingNode.user_id) {
						const { data: { session } } = await supabase.auth.getSession();
						if (session?.user?.id) {
							await supabase
								.from('nodes')
								.update({ user_id: session.user.id })
								.eq('node_identifier', nodeId);
						}
					}
	
					queryClient.invalidateQueries({ queryKey: ['session'] });
					onOpenChange(false);
				}
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[560px] max-h-[85vh] overflow-y-auto p-6 bg-brand-grey border border-brand-darkblue rounded-none">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-candu tracking-wide uppercase text-brand-darkblue">{chrome.i18n.getMessage("auth_login")}</DialogTitle>
					<DialogDescription className="text-brand-darkblue/80">
						{chrome.i18n.getMessage("auth_description")}
					</DialogDescription>
				</DialogHeader>

				
					<Tabs defaultValue="signup" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="signup">{chrome.i18n.getMessage("auth_signup")}</TabsTrigger>
							<TabsTrigger value="login">{chrome.i18n.getMessage("auth_login")}</TabsTrigger>
						</TabsList>

					<TabsContent value="signup" className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						{success ? (
							<Alert className="my-4">
								<AlertDescription className="text-center">
									{success}
								</AlertDescription>
							</Alert>
						) : (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="display-name" className="text-brand-darkblue">{chrome.i18n.getMessage("auth_displayName")}</Label>
									<Input
										id="display-name"
										type="text"
										value={displayName}
										onChange={(e) => setDisplayName(e.target.value)}
										placeholder={chrome.i18n.getMessage("auth_enterDisplayName")}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email" className="text-brand-darkblue">{chrome.i18n.getMessage("auth_email")}</Label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder={chrome.i18n.getMessage("auth_enterEmail")}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password" className="text-brand-darkblue">{chrome.i18n.getMessage("auth_password")}</Label>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder={chrome.i18n.getMessage("auth_createPassword")}
									/>
								</div>
								<Button 
									className="w-full bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none" 
									onClick={() => handleAuth("signup")} 
									disabled={loading}
								>
									{loading ? chrome.i18n.getMessage("auth_creatingAccount") : chrome.i18n.getMessage("auth_signup")}
								</Button>
							</div>
						)}
					</TabsContent>

					<TabsContent value="login" className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="login-email" className="text-brand-darkblue">{chrome.i18n.getMessage("auth_email")}</Label>
								<Input
									id="login-email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder={chrome.i18n.getMessage("auth_enterEmail")}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="login-password" className="text-brand-darkblue">{chrome.i18n.getMessage("auth_password")}</Label>
								<Input
									id="login-password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder={chrome.i18n.getMessage("auth_enterPassword")}
								/>
							</div>
							<Button 
								className="w-full bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none" 
								onClick={() => handleAuth("login")} 
								disabled={loading}
							>
								{loading ? chrome.i18n.getMessage("auth_loggingIn") : chrome.i18n.getMessage("auth_login")}
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};