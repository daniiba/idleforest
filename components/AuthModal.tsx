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
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Welcome to Idle Forest</DialogTitle>
					<DialogDescription>
						Create an account to track your impact and earn rewards
					</DialogDescription>
				</DialogHeader>

				
					<Tabs defaultValue="signup" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="signup">Sign Up</TabsTrigger>
							<TabsTrigger value="login">Login</TabsTrigger>
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
									<Label htmlFor="display-name">Display Name</Label>
									<Input
										id="display-name"
										type="text"
										value={displayName}
										onChange={(e) => setDisplayName(e.target.value)}
										placeholder="Enter your display name"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Create a password"
									/>
								</div>
								<Button 
									className="w-full" 
									onClick={() => handleAuth("signup")} 
									disabled={loading}
								>
									{loading ? "Creating account..." : "Sign up"}
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
								<Label htmlFor="login-email">Email</Label>
								<Input
									id="login-email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="login-password">Password</Label>
								<Input
									id="login-password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
								/>
							</div>
							<Button 
								className="w-full" 
								onClick={() => handleAuth("login")} 
								disabled={loading}
							>
								{loading ? "Logging in..." : "Login"}
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};