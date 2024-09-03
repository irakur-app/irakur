/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { targetLanguages } from '../../language-templates';

const LanguageWizard = (
	{
		finishWizard
	}: {
		finishWizard: (targetLanguageName: string | null, auxiliaryLanguageName: string | null) => void
	}
): JSX.Element => {
	const [targetLanguage, setTargetLanguage] = useState<string>('');
	const [auxiliaryLanguage, setAuxiliaryLanguage] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleSubmit = (): void => {
		setIsSubmitting(true);

		finishWizard(
			targetLanguage === '' ? null : targetLanguage,
			auxiliaryLanguage === '' ? null : auxiliaryLanguage
		);
	};

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Language wizard</title>
			</Helmet>
			<h1>Irakur - Language wizard</h1>

			<p>What language do you want to learn?</p>
			<select
				value={targetLanguage || ''}
				onChange={(event): void => setTargetLanguage(event.target.value)}
			>
				<option value="">Configure it yourself</option>
				{
					Object.keys(targetLanguages).sort().map(
						(targetLanguage: string) => (
							<option
								key={targetLanguage}
								value={targetLanguage}
								onClick={
									(): void => {
										if (targetLanguage === '') {
											handleSubmit();
										}
										setTargetLanguage(targetLanguage);
									}
								}
							>
								{targetLanguage}
							</option>
						)
					)
				}
			</select>
			<br />
			<br />

			<p>What language do you already know?</p>
			<select
				defaultValue={auxiliaryLanguage || ''}
				disabled={targetLanguage === ''}
				onChange={(event): void => setAuxiliaryLanguage(event.target.value)}
			>
				<option value="">Configure it yourself</option>
				{
					(targetLanguage !== '') && Object.keys(targetLanguages[targetLanguage].templates).sort().map(
						(auxiliaryLanguage: string) => (
							<option
								key={auxiliaryLanguage}
								value={auxiliaryLanguage}
								onClick={
									(): void => {
										setAuxiliaryLanguage(auxiliaryLanguage);
									}
								}
							>
								{
									auxiliaryLanguage === targetLanguage
										? `${auxiliaryLanguage} (Monolingual)`
										: auxiliaryLanguage
								}
							</option>
						)
					)
				}
			</select>
			<br />
			<br />
			<br />

			<button
				type="submit"
				disabled={isSubmitting}
				onClick={handleSubmit}
			>
				Submit
			</button>
		</HelmetProvider>
	);
};

export { LanguageWizard };
