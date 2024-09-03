/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { useState } from 'react';

import { AddLanguageForm } from '../../components/add-language-form';
import { LanguageWizard } from '../../components/language-wizard';

const AddLanguage = (): JSX.Element => {
	const [targetLanguageName, setTargetLanguageName] = useState<string | null>(null);
	const [auxiliaryLanguageName, setAuxiliaryLanguageName] = useState<string | null>(null);
	const [isWizardDone, setIsWizardDone] = useState<boolean>(false);

	if (!isWizardDone)
	{
		return <LanguageWizard
			finishWizard={
				(targetLanguageName: string | null, auxiliaryLanguageName: string | null): void => {
					setTargetLanguageName(targetLanguageName);
					setAuxiliaryLanguageName(auxiliaryLanguageName);
					setIsWizardDone(true);
				}
			}
		/>;
	}
	else
	{
		return (
			<AddLanguageForm
				targetLanguageName={targetLanguageName || ''}
				auxiliaryLanguageName={auxiliaryLanguageName || ''}
			/>
		);
	}
};

export { AddLanguage };
