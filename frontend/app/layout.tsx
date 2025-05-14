import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "NxtWavee - Career Insights",
	description:
		"Get personalized career insights and upskilling recommendations",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<main className='container mx-auto px-4 py-8 max-w-6xl'>
					{children}
				</main>
			</body>
		</html>
	);
}
