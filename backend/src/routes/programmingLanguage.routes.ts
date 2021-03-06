//External Dependencies Import
import { Request, Response, Router } from 'express';
import { Op } from 'sequelize';

//Local Dependencies Import
import { programmingLanguage } from '../models';
import { checkAdmin } from '../auth';

//Variable Declarations
const router = Router();

/**
 * @api {get} /api/language/ Returns all languages
 */
router.get('/', async (req: Request, res: Response) => {
    const ids = req.query.ids as string;

    const conditions = {} as any;

    if (ids) {
        conditions.programmingLanguageID = { [Op.in]: ids.split(',') };
    }

    try {
        const languages = await programmingLanguage.findAll({
            where: conditions,
        });
        res.json({
            success: true,
            error: '',
            data: languages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error,
        });
    }
});

/**
 * @api {post} /api/language/ Create a new language
 */
router.post('/', checkAdmin, async (req: Request, res: Response) => {
    if (
        !req.body.programmingLanguageName ||
        !req.body.programmingLanguageIcon ||
        !req.body.programmingLanguageURL ||
        !req.body.programmingLanguageDescription
    ) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields.',
        });
    }

    try {
        const language = await programmingLanguage.create({
            programmingLanguageName: req.body.programmingLanguageName,
            programmingLanguageDescription: req.body.programmingLanguageDescription,
            programmingLanguageIcon: req.body.programmingLanguageIcon,
            programmingLanguageURL: req.body.programmingLanguageURL,
        });
        res.status(201).json({
            success: true,
            error: '',
            data: language,
        });
    } catch (error: any) {
        //If error is same name, return error
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: `The language ${req.body.programmingLanguageName} already exists.`,
            });
        }

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @api {put} /api/language/ Edits the language with the specified id
 */
router.put('/', checkAdmin, async (req: Request, res: Response) => {
    const language = await programmingLanguage.findByPk(req.body.programmingLanguageID);
    if (!language) {
        return res.status(404).json({
            success: false,
            error: 'Language not found.',
        });
    }

    if (
        !req.body.programmingLanguageName &&
        !req.body.programmingLanguageIcon &&
        !req.body.programmingLanguageURL &&
        !req.body.programmingLanguageDescription
    ) {
        return res.status(400).json({
            success: false,
            error: 'Please provide a valid programmingLanguageName, programmingLanguageIcon, programmingLanguageDescription or programmingLanguageURL.',
        });
    }

    try {
        const updatedLanguage = await language.update({
            programmingLanguageName: req.body.programmingLanguageName,
            programmingLanguageDescription: req.body.programmingLanguageDescription,
            programmingLanguageIcon: req.body.programmingLanguageIcon,
            programmingLanguageURL: req.body.programmingLanguageURL,
        });
        res.json({
            success: true,
            error: '',
            data: updatedLanguage,
        });
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: `The language ${req.body.programmingLanguageName} already exists.`,
            });
        }

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * @api {delete} /api/language/ Delete a language
 */
router.delete('/', checkAdmin, async (req: Request, res: Response) => {
    if (!req.body.programmingLanguageID) {
        return res.status(400).json({
            success: false,
            error: 'Please provide a programmingLanguageID',
        });
    }

    try {
        // Delete country from database
        const language = await programmingLanguage.destroy({
            where: { programmingLanguageID: req.body.programmingLanguageID },
        });

        if (language === 0) {
            return res.status(404).json({
                success: false,
                error: 'Language not found',
            });
        } else {
            return res.status(200).json({
                success: true,
                error: '',
                message: 'Language deleted',
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;
