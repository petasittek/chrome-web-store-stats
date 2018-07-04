const CLASS_DIFF_PLUS = 'item_diff--plus';
const CLASS_DIFF_ZERO = 'item_diff--zero';
const CLASS_DIFF_MINUS = 'item_diff--minus';

/**
 * Build HTML for email
 *
 * @param {Array} extensionIds
 * @param {Object} metadata
 *
 * @returns {string}
 */
const build = (extensionIds, metadata) => {
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

    for (const extensionId of extensionIds) {
        let installCountDiffClass = CLASS_DIFF_ZERO;
        if (metadata[extensionId].installCountDiff > 0) {
            metadata[extensionId].installCountDiff = `+${metadata[extensionId].installCountDiff}`;
            installCountDiffClass = CLASS_DIFF_PLUS;
        } else if (metadata[extensionId].installCountDiff < 0) {
            installCountDiffClass = CLASS_DIFF_MINUS;
        }

        let ratingCountDiffClass = CLASS_DIFF_ZERO;
        if (metadata[extensionId].ratingCountDiff > 0) {
            metadata[extensionId].ratingCountDiff = `+${metadata[extensionId].ratingCountDiff}`;
            ratingCountDiffClass = CLASS_DIFF_PLUS;
        } else if (metadata[extensionId].ratingCountDiff < 0) {
            ratingCountDiffClass = CLASS_DIFF_MINUS;
        }

        let ratingValueDiffClass = CLASS_DIFF_ZERO;
        metadata[extensionId].ratingValueDiff = metadata[extensionId].ratingValueDiff.toFixed(2);
        if (metadata[extensionId].ratingValueDiff > 0) {
            metadata[extensionId].ratingValueDiff = `+${metadata[extensionId].ratingValueDiff}`;
            ratingValueDiffClass = CLASS_DIFF_PLUS;
        } else if (metadata[extensionId].ratingValueDiff < 0) {
            ratingValueDiffClass = CLASS_DIFF_MINUS;
        }

        let reviewCountDiffClass = CLASS_DIFF_ZERO;
        if (metadata[extensionId].reviewCountDiff > 0) {
            metadata[extensionId].reviewCountDiff = `+${metadata[extensionId].reviewCountDiff}`;
            reviewCountDiffClass = CLASS_DIFF_PLUS;
        } else if (metadata[extensionId].reviewCountDiff < 0) {
            reviewCountDiffClass = CLASS_DIFF_MINUS;
        }


        let supportCountDiffClass = CLASS_DIFF_ZERO;
        if (metadata[extensionId].supportCountDiff > 0) {
            metadata[extensionId].supportCountDiff = `+${metadata[extensionId].supportCountDiff}`;
            supportCountDiffClass = CLASS_DIFF_PLUS;
        } else if (metadata[extensionId].supportCountDiff < 0) {
            supportCountDiffClass = CLASS_DIFF_MINUS;
        }

        html += `<tr class="item">
                    <td class="item__name ${metadata[extensionId].errorOccured ? 'item__name--error' : ''}">
                        <a class="item__link item__link--blue" target="_blank" href="${metadata[extensionId].url}">
                            ${metadata[extensionId].name}
                        </a>
                        ${metadata[extensionId].errorOccured ? '<br>Error ' + metadata[extensionId].errorType : ''}
                    </td>
                    
                    <td>
                        <span class="item_number">
                            ${metadata[extensionId].installCount}
                        </span>
                        <br>
                        <span class="item_diff ${installCountDiffClass}">
                            ${metadata[extensionId].installCountDiff}
                        </span>
                    </td>
                    
                    <td>
                        <span class="item_number">
                            ${metadata[extensionId].ratingCount}
                        </span>
                        <br>
                        <span class="item_diff ${ratingCountDiffClass}">
                            ${metadata[extensionId].ratingCountDiff}
                        </span>
                    </td>
                    
                    <td>
                        <span class="item_number">
                            ${metadata[extensionId].ratingValue.toFixed(2)}
                        </span>
                        <br>
                        <span class="item_diff ${ratingValueDiffClass}">
                            ${metadata[extensionId].ratingValueDiff}
                        </span>
                    </td>
                    
                    <td>
                        <a class="item__link" target="_blank" href="${metadata[extensionId].urlReviews}">
                            <span class="item_number">
                                ${metadata[extensionId].reviewCount}
                            </span>
                            <br>
                            <span class="item_diff ${reviewCountDiffClass}">
                                ${metadata[extensionId].reviewCountDiff}
                            </span>
                        </a>
                    </td>
                    
                    <td>
                        <a class="item__link" target="_blank" href="${metadata[extensionId].urlSupport}">
                            <span class="item_number">
                                ${metadata[extensionId].supportCount}
                            </span>
                            <br>
                            <span class="item_diff ${supportCountDiffClass}">
                                ${metadata[extensionId].supportCountDiff}
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
