using System;
using System.IO;
namespace passionLecture;

public partial class livres : ContentPage
{
	public livres()
	{
		InitializeComponent();
        DisplayBooksArray();
	}

    

    public string[] GetBooks()
    {
       string[] test = Directory.GetDirectories(Directory.GetCurrentDirectory());
       string folderPath = Path.Combine(Environment.CurrentDirectory, "Ressources/", "Images/", "livres/");

        if (Directory.Exists(folderPath))
        {
            string[] books = Directory.GetFiles(folderPath);
            return books;
        }
        else
        {
            List<string> errors = new List<string>();
            string error = "no books found";
            errors.Add(error);
            return errors.ToArray();
        }
    }
    public void DisplayBooksArray()
    {
        foreach (string book in GetBooks())
        {
            ImageButton bookCover = new ImageButton();
            bookCover.Source = book;
            booksPage.Children.Add(bookCover);
        }       
    }
}