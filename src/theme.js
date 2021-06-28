import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import vars from './styles/constant';

const {
  primaryColor,
  secondaryColor,
  primaryTextColor,
  lightBorderColor,
  radius,
  primaryColorHover,
  whiteColor,
  outlinedButtonHover,
  primaryBgColor,
  inputTextColor,
  iconButtonHover,
  primaryTransition,
  fontFamily,
  noInstanceColor,
} = vars;

const theme = createMuiTheme({
  typography: {
    fontFamily,
    h3: {
      fontWeight: '600',
      fontSize: '1.5rem',
      lineHeight: '1.8125rem',
      color: primaryTextColor,
    },
  },

  overrides: {
    MuiFilledInput: {
      root: {
        fontFamily,
        backgroundColor: lightBorderColor,
        height: '2.375rem',
        borderRadius: `${radius}px !important`,
        paddingRight: `0.4375rem !important`,
        '&:hover': {
          backgroundColor: lightBorderColor,
        },
        '& .MuiInputAdornment-positionStart': {
          marginTop: `0 !important`,
        },
      },
      input: {
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: '0.75rem',
        letterSpacing: '-0.01em',
        color: inputTextColor,
        '&::placeholder': {
          color: inputTextColor,
        },
      },
      adornedEnd: {
        '& .MuiButton-root': {
          padding: '0.3125rem',
          minWidth: 1,
          fontSize: '0.75rem',
          fontWeight: '600',
          height: 'auto',
          color: whiteColor,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: 0,
        borderRadius: radius,
        backgroundColor: lightBorderColor,
        '&:hover': {
          backgroundColor: iconButtonHover,
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: radius,
        height: '2.375rem',
        padding: 0,
        minWidth: '9.875rem',
      },
      label: {
        textTransform: 'none',
        display: 'block',
        height: '100%',
        '& label': {
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: '600',
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          '& input': {
            display: 'none',
          },
        },
      },
      containedPrimary: {
        backgroundColor: primaryColor,
        '&:hover': {
          backgroundColor: primaryColorHover,
        },
      },
      outlinedPrimary: {
        borderColor: primaryColor,
        color: primaryColor,
        '&:hover': {
          backgroundColor: outlinedButtonHover,
        },
      },
    },
    MuiCssBaseline: {
      '@global': {
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        ' body': {
          backgroundColor: secondaryColor,
        },
        '.main-structure': {
          display: 'flex',
        },
        '.sidebar': {
          width: '18.75rem',
          overflow: 'hidden',
          backgroundColor: secondaryColor,
          height: '100vh',
          padding: '1rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          transition: primaryTransition,
          '&.shrink': {
            width: '4.125rem',
            transition: primaryTransition,
            '& .sidebar': {
              '&-header': {
                '&> img': {
                  marginBottom: '1.1875rem',
                  paddingBottom: '1.1875rem',
                  borderBottom: `0.0625rem solid ${lightBorderColor}`,
                },
              },
              '&-footer': {
                '& .MuiButton-root': {
                  '& label': {
                    fontSize: 0,
                  },
                },
              },
            },
            '& .MuiButtonBase-root': {
              padding: 0,
              width: '2.25rem',
              minWidth: '0.0625rem',
              fontSize: 0,
              margin: '0 auto',
              display: 'block',
              height: '2.25rem',
            },
          },
          '&:not(.shrink)': {
            '& .sidebar': {
              '&-header': {
                '& .MuiIconButton-root': {
                  backgroundColor: 'transparent',
                },
                '& .MuiFormControl-root': {
                  marginTop: '0.875rem',
                },
              },
              '&-footer': {
                '& .MuiIconButton-root': {
                  width: '1rem',
                  height: '1rem',
                  borderRadius: radius - 4,
                },
                '& .MuiButton-contained': {
                  width: '100%',
                  '& img': {
                    marginRight: '0.3125rem',
                  },
                },
              },
            },
          },
          '&-header': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1.1875rem',
            borderBottom: `0.0625rem solid ${lightBorderColor}`,
            flexWrap: 'wrap',
            '&> img': {
              cursor: 'pointer',
              maxWidth: '100%',
              transition: primaryTransition,
            },
          },
          '&-body': {
            padding: '1.1875rem 0',
            flexGrow: 1,
            '& .no-instance': {
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontWeight: '600',
              letterSpacing: '-0.01em',
              color: noInstanceColor,
              textAlign: 'center',
            },
          },
          '&-footer': {
            '& .MuiButton-contained': {
              padding: 0,
              width: '100%',
              '& .MuiButton-label': {
                display: 'block',
                height: '100%',
              },
              '& label': {
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                '& input': {
                  display: 'none',
                },
              },
            },
            '& .support': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: `0.0625rem solid ${lightBorderColor}`,
              '& p': {
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.75rem',
                letterSpacing: '-0.01em',
                color: vars.whiteColor,
                fontWeight: '400',
                '& img': {
                  marginRight: '0.625rem',
                },
              },
            },
          },
        },
        '.content': {
          backgroundColor: primaryBgColor,
          borderTopLeftRadius: radius * 2,
          borderBottomLeftRadius: radius * 2,
          flexGrow: 1,
        },
        '.MuiBox-empty': {
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          flexDirection: 'column',
          '& h3': {
            marginBottom: '1.5rem',
          },
        },
      },
    },
  },
});

export default theme;
