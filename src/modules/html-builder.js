const CLASS_DIFF_PLUS = 'item_diff--plus';
const CLASS_DIFF_ZERO = 'item_diff--zero';
const CLASS_DIFF_MINUS = 'item_diff--minus';

/**
 * Build HTML for email
 *
 * @param {Object} extensions
 * @param {Object} metadata
 *
 * @returns {string}
 */
const build = (extensions, metadata) => {
    let html = `
                <html>
                    <head>
                        <style>
                            .wrapper {
                                border: 1px solid #e0e0e0;
                                border-collapse: collapse;
                                text-align: right;
                                width: 100%;
                            }
                            
                            .item {
                                border-top: 1px solid #d0d0d0;
                            }
                            
                            .item__name {
                                text-align: left;
                            }
                            
                            .item__name--error {
                                color: #ff0000;
                            }
                            
                            .item__link {
                                text-decoration: none;
                            }
                            
                            .item__link--blue {
                                color: #5290ff;
                            }
                            
                            .item_number {
                                color: #000000;
                            }
                            
                            .item_diff {}
                            
                            .item_diff--plus {
                                color: #00d200;
                            }
                            
                            .item_diff--zero {
                                color: #d0d0d0;
                            }
                            
                            .item_diff--minus {
                                color: #f13b3b;
                            }
                        </style>
                    </head>
                    <body>
                        <table class="wrapper">
                            <tr style="font-weight: bold;">
                                <td style="text-align: left;">Name</td>
                                <td>Installs</td> 
                                <td>Rating count</td> 
                                <td>Rating value</td> 
                                <td>Review count</td> 
                                <td>Support count</td> 
                            </tr>`;

    for (const extensionId of Object.keys(extensions)) {
        let name = extensions[extensionId];
        let installCountDiffClass = CLASS_DIFF_ZERO;
        let extensionMetadata = metadata[extensionId];

        if (extensionMetadata.installCountDiff > 0) {
            extensionMetadata.installCountDiff = `+${extensionMetadata.installCountDiff}`;
            installCountDiffClass = CLASS_DIFF_PLUS;
        } else if (extensionMetadata.installCountDiff < 0) {
            installCountDiffClass = CLASS_DIFF_MINUS;
        }

        let ratingCountDiffClass = CLASS_DIFF_ZERO;
        if (extensionMetadata.ratingCountDiff > 0) {
            extensionMetadata.ratingCountDiff = `+${extensionMetadata.ratingCountDiff}`;
            ratingCountDiffClass = CLASS_DIFF_PLUS;
        } else if (extensionMetadata.ratingCountDiff < 0) {
            ratingCountDiffClass = CLASS_DIFF_MINUS;
        }

        let ratingValueDiffClass = CLASS_DIFF_ZERO;
        extensionMetadata.ratingValueDiff = extensionMetadata.ratingValueDiff.toFixed(2);
        if (extensionMetadata.ratingValueDiff > 0) {
            extensionMetadata.ratingValueDiff = `+${extensionMetadata.ratingValueDiff}`;
            ratingValueDiffClass = CLASS_DIFF_PLUS;
        } else if (extensionMetadata.ratingValueDiff < 0) {
            ratingValueDiffClass = CLASS_DIFF_MINUS;
        }

        let reviewCountDiffClass = CLASS_DIFF_ZERO;
        if (extensionMetadata.reviewCountDiff > 0) {
            extensionMetadata.reviewCountDiff = `+${extensionMetadata.reviewCountDiff}`;
            reviewCountDiffClass = CLASS_DIFF_PLUS;
        } else if (extensionMetadata.reviewCountDiff < 0) {
            reviewCountDiffClass = CLASS_DIFF_MINUS;
        }


        let supportCountDiffClass = CLASS_DIFF_ZERO;
        if (extensionMetadata.supportCountDiff > 0) {
            extensionMetadata.supportCountDiff = `+${extensionMetadata.supportCountDiff}`;
            supportCountDiffClass = CLASS_DIFF_PLUS;
        } else if (extensionMetadata.supportCountDiff < 0) {
            supportCountDiffClass = CLASS_DIFF_MINUS;
        }

        html += `<tr class="item">
                    <td class="item__name ${extensionMetadata.errorOccured ? 'item__name--error' : ''}">
                        <a class="item__link item__link--blue" target="_blank" href="${extensionMetadata.url}">
                            ${name}
                        </a>
                        ${extensionMetadata.errorOccured ? '<br>Error ' + extensionMetadata.errorType : ''}
                    </td>
                    
                    <td>
                        <span class="item_number">
                            ${extensionMetadata.installCount}
                        </span>
                        <br>
                        <span class="item_diff ${installCountDiffClass}">
                            ${extensionMetadata.installCountDiff}
                        </span>
                    </td>
                    
                    <td>
                        <span class="item_number">
                            ${extensionMetadata.ratingCount}
                        </span>
                        <br>
                        <span class="item_diff ${ratingCountDiffClass}">
                            ${extensionMetadata.ratingCountDiff}
                        </span>
                    </td>
                    
                    <td>
                        <span class="item_number">
                            ${extensionMetadata.ratingValue.toFixed(2)}
                        </span>
                        <br>
                        <span class="item_diff ${ratingValueDiffClass}">
                            ${extensionMetadata.ratingValueDiff}
                        </span>
                    </td>
                    
                    <td>
                        <a class="item__link" target="_blank" href="${extensionMetadata.urlReviews}">
                            <span class="item_number">
                                ${extensionMetadata.reviewCount}
                            </span>
                            <br>
                            <span class="item_diff ${reviewCountDiffClass}">
                                ${extensionMetadata.reviewCountDiff}
                            </span>
                        </a>
                    </td>
                    
                    <td>
                        <a class="item__link" target="_blank" href="${extensionMetadata.urlSupport}">
                            <span class="item_number">
                                ${extensionMetadata.supportCount}
                            </span>
                            <br>
                            <span class="item_diff ${supportCountDiffClass}">
                                ${extensionMetadata.supportCountDiff}
                            </span>
                        </td>
                    </a>
                </tr>`;
    }

    html += `       </table>
                </body>
            </html>`;

    return html;
};

module.exports = {
    build,
};
